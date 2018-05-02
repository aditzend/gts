import './car-show.html';
import './car-edit.js';
import "./car-sell.js";

//calcula los kms diarios
function dkms(km,year) {
    const age =2
        km /
        (
            (moment().year() - year) * 12 * 30
        );
    return age.toFixed(0);
}
//calcula la fecha de recambio, time pueden ser los km o los meses
function xng(exchange,uom,pdate,dkms) {
    let days;
    switch (uom) {
        case "km":
            days = exchange/dkms;
            break;
        case "years":
            days = exchange * 365;    
            break;
        case "months":
            days = exchange * 30;
    }

    return moment().add(days,'days');
}

Template.Car_show.onCreated(function() {
    console.log("data en car show ", this.data);
    this.state = new ReactiveDict();
    this.state.setDefault({
        showingOptionButtons: false,
        expanded: false
    });
    this.autorun(() => {
        this.subscribe("families.all");
    });
});




Template.Car_show.helpers({

    sellArgs(id) {
        return {
            carId: id,
            foo: "bar"
        }
    },

    car() {
        return Template.instance().data.car;
    },
    daylyKm() {
        const data = Template.instance().data;
        return dkms(data.km, data.year);
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
    productFamilies() {
      return [123,23,2];
    }
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

    }

});
