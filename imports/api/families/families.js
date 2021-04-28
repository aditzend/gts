import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Families = new Mongo.Collection('families');

Families.before.insert(function (userId, doc) {
    doc.createdAt = moment().format();
    doc.author = doc.author || Meteor.userId();
    doc.owner = doc.owner || Meteor.user().name;
});

Meteor.methods({
    'families.insert'(data) {
        check(data, Object);
        if (!Meteor.user()) {
            throw new Meteor.Error("no autorizado");
        }
        Families.insert({
            name: data.name,
            exchange: data.exchange,
            uom: data.uom
        });
    },
    'families.remove'(id) {
        check(id, String)
        if (!Meteor.user()) {
            throw new Meteor.Error("no autorizado");
        }
        Families.remove(id)
    },
    'families.secret-insert'(data) {

        const newFamily = Families.insert({
            name: data.name,
            exchange: data.exchange,
            uom: data.uom,
            author: data.author,
            owner: data.owner,
        });
        console.log('Family created ', newFamily)
        return `Family created : ${newFamily}`


    }
});