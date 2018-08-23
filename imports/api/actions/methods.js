import {
    check
} from 'meteor/check';
import {
    Email
} from 'meteor/email';


Actions.insert({
   type:'validation',
   userId: 29984695,
   dnis: '32222333222',
   channel: 1,
   score: 98.07,
   passed: true,
   isError: false,
   callID: 'pw98fpw489hfpaw498fjw',
    createdAt: new Date(),
})

Meteor.methods({
    'actions.insert' (data) {
        check(data, Object);
        Actions.insert({
            plate: data.plate,
            brand: data.brand,
            model: data.model,
            year: data.year,
            km: data.km,
            carOwner: data.carOwner,
            createdAt: new Date()
        });
    },

    }
)