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
    async 'cars.sell' (data) {
        check(data, Object);
        console.log(`data in cars.sell `, data);

        if (!Meteor.userId()) {
            throw new Meteor.Error("no autorizado");
        }

        // enviar mails
        // crear Sale
        
        //  const emailData = {
        //      email: car.carOwner.email,
        //      givenName: car.carOwner.givenName,
        //      family: evt.target.name,
        //      dueDate: '2018.06.25T09:00:00-0300'
        //  };
        // let emailJob = Meteor.call('saveEmailJob', 'ad@alexanderditzend.com', 'Sofi', data.familyName, '2018-06-21T11:36:30-03:00');
        // Cars.update(data.carId, {
        //     $push: {
        //         purchases: {
        //             familyId: data.familyId,
        //             familyName: data.familyName,
        //             familyOwner: data.familyOwner,
        //             emailJob: emailJob,
        //             createdAt: new Date()
        //         }
        //     }
        // })
    }
})