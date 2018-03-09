import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Items = new Mongo.Collection('items');


Items.before.insert(function(userId, doc) {
    doc.createdAt = moment()
        .format();
    doc.author = Meteor.userId();
});




Meteor.methods({
    'cars.insert'(data) {
        check(data, Object);

        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Items.insert({
            type: "car",
            plate: data.plate,
            brand: data.brand,
            model: data.model,
            year: data.year,
            km: data.km,
            carOwner: data.carOwner,
            createdAt: new Date(),
            owner: Meteor.userId()
        });
    },
    'cars.sell' (data) {
        check(data, Object);

        if (!Meteor.userId()) {
            throw new Meteor.Error("no autorizado");
        }
        Items.update(data.carId, {
            $push: { 
                purchases: {
                        familyId: data.familyId,
                        familyName: data.familyName,
                        createdAt: new Date()
                    }
                }
            }
    )
    }
})