Meteor.publish(null,
    function() {
        if (this.userId) {
            return Payments.find();
        } else {
            this.ready();
        }
    });
