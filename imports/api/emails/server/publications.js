Meteor.publish("emails.own",
    function (company) {
        return Families.find({
            owner: company
        });
    });
Meteor.publish("emails.all",
    function () {
        return Families.find({
          
        });
    });
