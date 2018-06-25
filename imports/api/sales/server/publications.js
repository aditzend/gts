Meteor.publish("sales.own",
    function (company) {
        return Sales.find({
            owner: company
        });
    });