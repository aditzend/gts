Meteor.publish("sales.own",
    function (company) {
        return Sales.find({
            owner: company
        });
    });
Meteor.publish("sales.all",
    function (company) {
        return Sales.find();
    });