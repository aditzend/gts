Meteor.publish('cars.all',
    function() {
        return Cars.find();
    });