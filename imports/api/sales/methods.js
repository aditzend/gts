import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';
import moment from 'moment/moment';

function dailyKm(km, year) {
    let age = km /
        (
            (moment().year() - year) * 12 * 30
        );
    return age.toFixed(0);
};

//calcula la fecha de recambio o dueDate
function dueDate(exchange, uom, saleCreatedAt, dailyKm) {
    let add;
    let unit;
    switch (uom) {
        case "km":
            add = exchange / dailyKm;
            unit = 'days'
            break;
        case "year":
            add = exchange;
            unit = 'years'
            break;
        case "month":
            add = exchange;
            unit = 'months'
    }
    console.log(`Due Date: ${moment(saleCreatedAt).add(add, unit).toISOString()}` )
    return moment(saleCreatedAt).add(add, unit).toISOString();
};



Meteor.methods({
    'sales.insertWithDate' (data) {
        check(data, Object);
        const car = Cars.findOne({ _id: data.car.id });
        const family = Families.findOne({ _id: data.family.id });
        const dkm = dailyKm(
            car.km || "100000",
            car.year || "2016");
        const due = dueDate(family.exchange,
            family.uom,
            // "2018-05-02T02:59:10.567Z",
            data.originalCreatedAt,
            dkm);
      
        const sale = Sales.insert({
            car: {
                id: car._id
            },
            family: {
                id: family._id,
                name: family.name
            },
            dueDate: due,
            originalCreatedAt: moment(data.originalCreatedAt).toISOString(),
            // createdAt: moment().toISOString(),
            owner: family.owner,
            status: "ALIVE"
        });
        Meteor.call('saveEmailJob', car.carOwner.email, car.carOwner.givenName, family.name, due, family.owner, sale);
    },
    'cars.correct' () {
        Cars.find({
            createdAt: {
                $lt: "2018-06-27T12:00:00+00:00",
            },
            purchases: {
                $ne: undefined
            }
        }).forEach((car) => {
            for (i = 0; i < car.purchases.length; i++) {
                console.log(`Car :  ${car._id}\n
    Purchase # : ${i} \n
     Purchased Family : ${car.purchases[i].familyId} \n
     Purchased Moment : ${moment(car.purchases[i].createdAt).toISOString()} \n 
     Date.now() : ${Date.now()}`)
                let data = {
                    car: {
                        id: car._id
                    },
                    family: {
                        id: car.purchases[i].familyId
                    },
                    originalCreatedAt: moment(car.purchases[i].createdAt).toISOString()
                }
                Meteor.call("sales.insertWithDate", data)

            }
        })
    },
    'sales.insert' (data) {
        check(data, Object);
        const car = Cars.findOne({_id: data.car.id});
        const family = Families.findOne({_id: data.family.id});
        const dkm = dailyKm(car.km,car.year);
        const due = dueDate(family.exchange,
                            family.uom,
                            moment().toISOString(),
                        dkm);
        if (!Meteor.user()) {
            throw new Meteor.Error("no autorizado");
        }
        const sale = Sales.insert({
            car: {
                id: car._id
            },
            family: {
                id: family._id,
                name: family.name
            },
            dueDate: due,
            createdAt: moment().toISOString(),
            owner: family.owner,
            status:"ALIVE"
        });
        Meteor.call('saveEmailJob',car.carOwner.email,car.carOwner.givenName,family.name,due,family.owner, sale);
    },
    'sales.delete'(id) {
           if (!Meteor.user()) {
               throw new Meteor.Error("no autorizado");
           }
           Sales.remove({
              _id:id
           });
    }
});