import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Actions = new Mongo.Collection('actions');


Actions.before.insert(function (userId, doc) {
    doc.createdAt = moment().format();
});

