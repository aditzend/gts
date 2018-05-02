import './car-sell.html';


Template.Car_sell.onCreated(function() {
    this.autorun(() => {
        this.subscribe("userData");
        if (Meteor.user()) {
            this.subscribe("families.own", Meteor.user().name);
        }
    });
});


Template.Car_sell.helpers({
    families() {
        return Families.find();
    }
});

Template.Car_sell.events({
    'click .js-sell': function(e, instance) {
        console.log("vender ", e.target.owner);
        console.log("vender ", instance.data);
        Meteor.call("cars.sell", {
            carId: instance.data.carId,
             familyId: e.target.id,
             familyName: e.target.name,
             familyOwner:e.target.dataset.owner
            });
        // Meteor.call(
        //     'sendEmail',
        //     'Alice <pross888@gmail.com',
        //     'me@exa.com',
        //     'holaa',
        //     'test'
        // );
    }
})
