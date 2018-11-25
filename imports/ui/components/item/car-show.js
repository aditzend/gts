import './car-show.html';
import './car-edit.js';
import "./car-sell.js";

function dailyKm(km, year) {
    let age = km /
        (
            (moment().year() - year) * 12 * 30
        );
    return age.toFixed(6);
};

//calcula la fecha de recambio o dueDate, antes era el deathpoint
function dueDate(exchange,uom,saleCreatedAt,dailyKm) {
    let add;
    let unit;
    switch (uom) {
        case "km":
            add = exchange / dailyKm;
            unit = 'days'
            break;
        case "year":
            add = exchange;
            unit = 'years'
            break;
        case "month":
            add = exchange;
            unit = 'months'
    }
    return moment(saleCreatedAt).add(add, unit).format('DD.MM.YYYY');
};


Template.Car_show.onCreated(function() {
    console.log("data en car show ", this.data);
    this.state = new ReactiveDict();
    this.state.setDefault({
        showingOptionButtons: false,
        expanded: false
    });
    this.autorun(() => {
        this.subscribe("sales.own", Meteor.user().name);
        this.subscribe("families.own", Meteor.user().name);
    });
});




Template.Car_show.helpers({

    //no confundir con la funcion
    dailyKm(km, year) {
        return dailyKm(km,year)
    }, 

    //funciones nuevas

    dueDate(saleId){
        const sale = Sales.findOne({_id:saleId});
        const family = Families.findOne({_id:sale.family.id});
        const car = Cars.findOne({_id:sale.car.id});

        const exchange = family.exchange;
        const uom = family.uom;
        const saleCreatedAt = sale.createdAt;
        let dkm = dailyKm(car.km, car.year);
        console.log(`exchange ${exchange} \n
                    uom ${uom} \n
                    saleca ${saleCreatedAt} \n
                    car year ${car.year} \n
                    car km ${car.km} \n
                    dkm ${dkm}`);
        return dueDate(exchange, uom, saleCreatedAt, dkm);
        // return dueDate(exchange, uom, saleCreatedAt, dkm);
    },

    //fin funciones nuevas

    sellArgs(id) {
        return {
            carId: id,
            foo: "bar"
        }
    },

    car() {
        return Template.instance().data.car;
    },
    sales(carId) {
        return Sales.find({
            'car.id': carId,
            status: "ALIVE"
        });
    },
    familyX(f) {
        const exchange = Families.findOne({name:f}, { exchange: 1});
        return mkm(2,3);
    },
    exchangeDate(familyName, pdate) {
        const family = Families.findOne({ name: familyName }, { exchange: 1, uom:1 });
        const data = Template.instance().data;
        const dk =  dkms(data.km, data.year);

        // purchaseDate = moment(date).add(200, 'days').fromNow();
        return xng(family.exchange, family.uom, pdate, dk );
    },
    fexchangeDate(familyName, pdate) {
        const family = Families.findOne({ name: familyName }, { exchange: 1, uom:1 });
        const data = Template.instance().data;
        const dk =  dkms(data.km, data.year);

        // purchaseDate = moment(date).add(200, 'days').fromNow();
        return xng(family.exchange, family.uom, pdate, dk ).fromNow();
    },
    isActive(xng) {
        return (moment().isSameOrBefore(xng))? true : false;
        
        // return true;
    },
    familyName(id) {
        const f = Families.findOne({name: id}, {name:1});
        return f.name;
    },
    transDate(date) {
        // const md = moment(date);
        return moment(date).format("DD/MM/YYYY");
    },
   
   
    showingOptionButtons() {
        const instance = Template.instance();
        return instance.state.get('showingOptionButtons');
    },
    expanded() {
        const instance = Template.instance();
        return instance.state.get('expanded');
    },
});

Template.Car_show.events({
    'click .js-show-option-buttons': function(e, instance) {
        // instance.state.set('showingOptionButtons', true);
    },
    'click .js-hide-option-buttons': function(e, instance) {
        // instance.state.set('showingOptionButtons', false);
    },
    'click .js-expand': function(e, instance) {
        // instance.state.set('expanded', true);
    },
    'click .js-compress': function(e, instance) {
        // instance.state.set('expanded', false);


    },
    'click .js-delete': function(e, instance) {
        // instance.data.onDelete(instance.data.item._id);
    },
    'click .js-edit': function(e, instance) {
        // instance.data.onEdit(instance.data.item._id);

    },
    'click .js-delete-purchase':function(evt,ins) {

          swal({
                  title: "Borramos esta venta ?",
                  text: "No se puede recuperar esta informacion!",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Sí, borrar!",
                  cancelButtonText: "No, cancelar por favor!",
                  closeOnConfirm: false,
                  closeOnCancel: false
              },
              function (isConfirm) {
                  if (isConfirm) {
        Meteor.call('sales.delete', evt.target.id);
                      swal("Venta eliminada.", "Se borraron los datos", "success");
                  } else {
                      swal("Eliminación cancelada!", "La venta esta segura :)", "error");
                  }
              });
    }
});
