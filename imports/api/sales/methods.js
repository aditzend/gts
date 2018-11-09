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


const calculateKmsPerDay = function(km, purchaseYear, entryDate) {
    const entryDateM = moment(entryDate)
    console.log('TCL: calculateKmsPerDay -> entryDate', entryDateM);
    const purchaseDateM = moment(`${purchaseYear}-07-01`)
    console.log('TCL: calculateKmsPerDay -> purchaseDate', purchaseDateM);
    const daysPassedM = entryDateM.diff(purchaseDateM, 'days')
    console.log('TCL: calculateKmsPerDay -> daysPassed', daysPassedM);
    return Number(km)/Number(daysPassedM)

}

//calcula la fecha de recambio o dueDate
function dueDate(exchange, uom, saleCreatedAt, dkm) {
    let add;
    let unit;
    switch (uom) {
        case "km":
            add = exchange / dkm;
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
    'sales.insertLegacy' (carId, familyN, originallyCreatedAt) {
        check(carId, String)
        check(familyN, Number)
        check(originallyCreatedAt, Date)

        const car = Cars.findOne({ _id: carId })
        console.log('TCL: car', car.km, car.year);
        const family = Families.findOne({ n: familyN })
        const dkm = calculateKmsPerDay(car.km, car.year, originallyCreatedAt)
        console.log('TCL: dkm', dkm);
        
        const due = dueDate(family.exchange, family.uom, originallyCreatedAt ,dkm)
        console.log('TCL: due', due);
        console.log('TCL: family.uom', family.uom);
        console.log('TCL: family.exchange', family.exchange);
        const sale = Sales.insert({
            car: {
                id: carId
            },
            family: {
                id: family._id,
                name: family.name
            },
            dueDate: due,
            originallyCreatedAt: originallyCreatedAt,
            // createdAt: moment().toISOString(),
            owner: family.owner,
            status: "PAST"
        })
        console.log('TCL: sale', sale)
    },
    'sales.insertWithDate' (carId, familyId, originallyCreatedAt) {
        check(carId, String)
        check(familyId, String)
        console.log('TCL: familyId sales.insertWithDate', familyId);
        check(originallyCreatedAt, String)
        const car = Cars.findOne({ _id: carId });
        const family = Families.findOne({ _id: familyId });
        
        const dkm = calculateKmsPerDay(car.km, car.year, originallyCreatedAt)

        const due = dueDate(
                        family.exchange,
                        family.uom,
                        originallyCreatedAt,
                        dkm
                    );
      
        const sale = Sales.insert({
                        car: {
                            id: car._id
                        },
                        family: {
                            id: family._id,
                            name: family.name
                        },
                        dueDate: due,
                        originallyCreatedAt: moment(originallyCreatedAt).toISOString(),
                        // createdAt: moment().toISOString(),
                        owner: family.owner,
                        status: "TRANSFORMED"
                    });

        Meteor.call(
            'saveEmailJob',
            car.carOwner.email,
            car.carOwner.givenName,
            family.name,
            due,
            family.owner,
            sale
        )
    },
    'cars.correct' () {
        console.log(`correcting cars`);
        Cars.find({
            createdAt: {
                $lt: "2018-06-27T12:00:00+00:00",
            },
            purchases: {
                $ne: undefined
            },
            year: {
                $ne: ""
            },
            km: {
                $ne: ""
            }
        }).forEach((car) => {
            for (i = 0; i < car.purchases.length; i++) {
                console.log(`Car :  ${car._id}\n
                    Purchase # : ${i} \n
                    Purchased Family : ${car.purchases[i].familyId} \n
                    Purchased Moment : ${moment(car.purchases[i].createdAt).toISOString()} \n 
                    Date.now() : ${Date.now()}`
                )
                Meteor.call(
                    "sales.insertWithDate",
                    car._id,
                    car.purchases[i].familyId,
                    moment(car.purchases[i].createdAt).toISOString()
                )
            }
        })
    },
    'sales.insert' (data) {
        check(data, Object);
        const car = Cars.findOne({_id: data.car.id});
        const family = Families.findOne({_id: data.family.id});
        
        const dkm = calculateKmsPerDay(car.km,car.year,car.createdAt);
        

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