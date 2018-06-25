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
            car: {
                id:instance.data.carId,
                ownerGivenName:instance.data.car.brand
            },
            family:{
                id:e.target.id,
                name: e.target.name,
                owner: e.target.dataset.owner
            }
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
