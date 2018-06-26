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
    'click .js-sell': async function(evt, ins) {
        const saleData = {
            car: {
                id: ins.data.carId
            },
            family: {
                id: evt.target.id,
                name: evt.target.name,
                owner: evt.target.dataset.owner
            }
        };

        const priorSale = Sales.findOne({
            'car.id': saleData.car.id,
            'family.id':saleData.family.id,
            'status': 'ALIVE'
        });

        if (priorSale) {
         swal({
             title: `Ya vendimos ${saleData.family.name} a este auto!`,
             text: `El auto tiene  ${saleData.family.name} vigente`,
             type: "warning",
             showCancelButton: false,
             confirmButtonColor: "#DD6B55",
             confirmButtonText: "Ok",
             // cancelButtonText: "No, cancelar por favor!",
             closeOnConfirm: true,
             closeOnCancel: true
         });
        } else {
            Meteor.call('sales.insert', saleData);
        }

        
       
        
        
    }
})
