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
    'click .js-sell': function(evt, ins) {
        // console.log("vender ", e.target.owner);
        // console.log("vender ", instance.data);
        const car = Cars.findOne({_id:ins.data.carId});
        // Meteor.call("cars.sell", {
        //     car: {
        //         id:ins.data.carId,
        //         ownerGivenName:instance.data.car.brand
        //     },
        //     family:{
        //         id:e.target.id,
        //         name: e.target.name,
        //         owner: e.target.dataset.owner
        //     }
        //      });
        const emailData = {
            email: car.carOwner.email,
            givenName: car.carOwner.givenName,
            family: evt.target.name,
            dueDate: '2018.06.25T09:00:00-0300'
        };
        const emailJob = Meteor.call("saveEmailJob", emailData );
        const saleData = {
            emailJob: emailJob
        }
        console.log(`sale data  ___`, saleData);
        // Meteor.call("sales.insert", saleData)
        // Meteor.call(
        //     'sendEmail',
        //     'Alice <pross888@gmail.com',
        //     'me@exa.com',
        //     'holaa',
        //     'test'
        // );
    }
})
