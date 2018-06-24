Emails = new Mongo.Collection('emails');

Emails.before.insert(function (userId, doc) {
    doc.createdAt = moment()
        .format();
    doc.author = Meteor.userId();
});
