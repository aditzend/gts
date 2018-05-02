import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Families = new Mongo.Collection('families');

Families.before.insert(function(userId,doc) {
    doc.createdAt = moment().format();
    doc.author = Meteor.userId();
    doc.owner = Meteor.user().name;
});

Meteor.methods({
    'families.insert'(data) {
        check(data, Object);

        if(!Meteor.user()) {
            throw new Meteor.Error("no autorizado");
        }

        Families.insert({
            name: data.name,
            exchange: data.exchange,
            uom: data.uom
        });
    }
});