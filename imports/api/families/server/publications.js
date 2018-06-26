
Meteor.publish("families.own", 
    function(company) {
        return Families.find({owner: company});
    });

Meteor.publish("families.all", 
    function() {
        return Families.find({});
    });
