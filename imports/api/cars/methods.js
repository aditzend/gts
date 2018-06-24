import {
    check
} from 'meteor/check';
import {
    Email
} from 'meteor/email';

Meteor.methods({
    'cars.insert' (data) {
        check(data, Object);

        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Cars.insert({
            plate: data.plate,
            brand: data.brand,
            model: data.model,
            year: data.year,
            km: data.km,
            carOwner: data.carOwner,
            createdAt: new Date()
        });
    },
    'cars.sell' (data) {
        check(data, Object);
    

        if (!Meteor.userId()) {
            throw new Meteor.Error("no autorizado");
        }
        let emailJob = Meteor.call('saveEmailJob', 'ad@alexanderditzend.com', 'Sofi', data.familyName, '2018-06-21T11:36:30-03:00');
        Cars.update(data.carId, {
            $push: {
                purchases: {
                    familyId: data.familyId,
                    familyName: data.familyName,
                    familyOwner: data.familyOwner,
                    emailJob: emailJob,
                    createdAt: new Date()
                }
            }
        })
    }
})