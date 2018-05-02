
Meteor.publish("families.own", 
    function(company) {
        return Families.find({owner: company});
    });
