Meteor.publish('actions.all',
    function() {
        return actions.find();
    });