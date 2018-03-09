Meteor.publish("families.all", 
    function() {
        return Families.find({});
    });