import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';

Meteor.methods({
    'sales.insert' (data) {
        check(data, Object);

        if (!Meteor.user()) {
            throw new Meteor.Error("no autorizado");
        }

        Sales.insert({
            name: data.name,
            exchange: data.exchange,
            uom: data.uom
        });
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