Payments = new Mongo.Collection('payments');
Payments.before.insert(function(userId, doc) {
    doc.createdAt = moment()
        .format();
    doc.author = Meteor.userId();
});
