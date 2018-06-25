import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    check
} from 'meteor/check';

Sales = new Mongo.Collection('sales');

Sales.before.insert(function (userId, doc) {
    doc.createdAt = moment().format();
    doc.author = Meteor.userId();
    doc.owner = Meteor.user().name;
});

