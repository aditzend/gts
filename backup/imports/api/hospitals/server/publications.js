import {
    Meteor
}
from 'meteor/meteor';

Meteor.publish(null, function hospitals(originId) {
    if (this.userId) {
        return Hospitals.find({ }
        );
    } else {
        this.ready();
    }

});
