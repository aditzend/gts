Hospitals = new Mongo.Collection('hospitals');
Hospitals.before.insert(function(userId, doc) {
    doc.createdAt = moment()
        .format();
    doc.author = Meteor.userId();
});
