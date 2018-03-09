import {
    Meteor
}
from 'meteor/meteor';


import {
    Template
}
from 'meteor/templating';
import {
    Mongo
}
from 'meteor/mongo';
import {
    Tracker
}
from 'meteor/tracker';

import {
    ReactiveDict
}
from 'meteor/reactive-dict';

import {
    FlowRouter
}
from 'meteor/kadira:flow-router';

import './car-edit.html';



Template.Car_edit.onCreated(function() {
    this.autorun(() => {
        let profitCenterSubscription = this.subscribe('profit_centers.test');
    });
});

Template.Car_edit.onRendered(function() {
    const instance = Template.instance();
    const item = instance.data.item;
    console.log('on rendered EDIT ITEM >>>>>>', item);
    instance.$('#nameInput')
        .val(item.name);

    // instance.$('#profitCenterSelect')
    //     .val('ffHRBxE9GjRY2TSzH');
    // not working   FIXXXXXXXXXXXXX




    instance.$('[data-action=form]')
        .validate({
            rules: {

            },
            messages: {

            },
            showErrors: function(errorMap, errorList) {
                instance.$("#summary")
                    .html("El formulario tiene errores (" +
                        this.numberOfInvalids() +
                        "), ver detalles en rojo.");
                this.defaultShowErrors();
            },
            submitHandler: function() {
                    const w = workfor('item-motor-edit.js');
                    let plate = instance.$('#plate').val();
                    let brand = instance.$('#brand').val();
                    let model = instance.$('#model').val();
                    let year = instance.$('#year').val();
                    let km = instance.$('#km').val();
                    let givenName = instance.$('#car-owner-given-name').val();
                    let lastName = instance.$('#car-owner-last-name').val();
                    let gender = instance.$('#car-owner-gender').val();
                    let email = instance.$('#car-owner-email').val();
                    let phone = instance.$('#car-owner-phone').val();
                    let birthdate = instance.$('#car-owner-birthdate').val();


                    if (item._id == undefined) {
                        console.log("INSERTING...");
                        const newItem = Items.insert({
                            type:"car",
                            plate: plate,
                            brand: brand,
                            model: model,
                            year: year,
                            km: km,
                            carOwner: {
                              givenName: givenName,
                              lastName: lastName,
                              gender: gender,
                              birthdate: birthdate,
                              email: email,
                              phone: phone
                            },
                            owner: w._id
                        });
                        instance.data.onSavedData(newItem);
                        swal({
                            title: plate + ' creado!',
                            type: "success"
                        });
                    } else {
                        console.log("UPDATING...");
                        Items.update({
                            _id: item._id
                        }, {
                            $set: {
                                plate:plate,
                                brand: brand,
                                model: model,
                                year: year,
                                km: km,
                            }
                        });
                        instance.data.onSavedData(item._id);
                        // swal({
                        //     title: name + ' actualizado!',
                        //     type: "success"
                        // });
                    }
                    //insert or edit if
                }
                //submit
        });
});

Template.Car_edit.helpers({

    selectedItem() {
        return Template.instance().data.item.name;
    }
})

Template.Car_edit.events({


    'click .js-cancel': function(e, instance) {
        this.onCancel(true);
        swal({
            title: 'Cancelado',
            text: 'Los cambios no se guardaron',
            type: 'warning'
        });
    },

    'submit form': function(e, instance) {
        e.preventDefault();

    }

});
