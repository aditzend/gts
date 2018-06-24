import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Cars = new Mongo.Collection('cars');


Cars.before.insert(function (userId, doc) {
    doc.createdAt = moment().format();
    doc.author = Meteor.userId();
});

