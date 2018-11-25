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

import React from 'react';
import {
    render
} from 'react-dom';

import './car-edit.html';



Template.Car_edit.onCreated(function() {
 
});

Template.Car_edit.onRendered(function() {
    //cargar react form


    const instance = Template.instance();
    const car = instance.data.car;
    console.log('on rendered EDIT ITEM >>>>>>', car);
    instance.$('#plate')
        .val(car.plate);



    instance.$('[data-action=car-edit-form]')
        .validate({
            rules: {
                
                year: {
                    required: true,
                    range: [1900,2050]
                },
                km: {
                    required: true,
                    range: [0,9999999]
                },
                email: {
                    required: true,
                    email: true
                },
                givenName: {
                    required: true,
                },
                birthdate: {
                    date: true
                },
                phone: {
                    digits: true,
                    minlength:8,
                    maxlength:16
                },
            },
            messages: {
                year: {
                    required: 'Falta completar Año!',
                    range: 'Año incorrecto!',
                },
                km: {
                    required: 'Falta completar Kms!',
                    range: 'Kms incorrectos!',
                },
                email: {
                    required: 'Falta completar email!',
                    email: 'Este no es un email válido!',
                },
                givenName: {
                    required: 'Falta completar el nombre',
                },
                birthdate: {
                    date: 'fecha invalida',
                },
                phone: {
                    digits: 'aca van solo numeros',
                    minlength: 'minimo 8 numeros',
                    maxlength: 'maximo 16 numeros'
                },
            },
            showErrors: function(errorMap, errorList) {
                console.log('form has errors')
              
                instance.$("#summary")
                    .html("El formulario tiene errores (" +
                        this.numberOfInvalids() +
                        "), ver detalles en rojo.");
                this.defaultShowErrors();
            },
            submitHandler: function (errorMap, errorList) {
                    console.log('form submited')
                    // const w = workfor('item-motor-edit.js');
                    let plate = instance.$('#plateInput').val();
                    let brand = instance.$('#brandInput').val();
                    let model = instance.$('#modelInput').val();
                    let year = instance.$('#yearInput').val();
                    let km = instance.$('#kmInput').val();
                    let givenName = instance.$('#givenNameInput').val();
                let lastName = instance.$('#lastNameInput').val();
                let birthdate = instance.$('#BirthdateInput').val();

                    // let gender = instance.$('#car-owner-gender').val();
                let isMale = instance.$('#carOwnerGenderInputMale').checked;
                    let email = instance.$('#emailInput').val();
                    let phone = instance.$('#car-owner-phone').val();
                    let origin = instance.$('#originSelect').val();


                    if (car._id == undefined) {
                        console.log("INSERTING...");
                        const newItem = Cars.insert({
                            plate: plate,
                            brand: brand,
                            model: model,
                            year: year,
                            km: km,
                            carOwner: {
                              givenName: givenName,
                              lastName: lastName,
                              birthdate: birthdate,
                              email: email,
                              phone: phone,
                              isMale: isMale,
                            },
                            origin: origin,
                            owner: 'GT'
                        });
                        instance.data.onSavedData(newItem);
                        swal({
                            title: plate + ' creado!',
                            type: "success"
                        });
                    } else {
                        console.log("UPDATING...");
                        Cars.update({
                            _id: car._id
                        }, {
                            $set: {
                                plate:plate,
                                brand: brand,
                                model: model,
                                year: year,
                                km: km,
                                carOwner: {
                                    givenName: givenName,
                                    lastName: lastName,
                                    isMale: isMale,
                                    // gender: gender,
                                    birthdate: birthdate,
                                    email: email,
                                    phone: phone
                                },
                                origin: origin,
                                owner: 'GT'
                            }
                        });
                        instance.data.onSavedData(car._id);
                        swal({
                            title: plate + ' actualizado!',
                            type: "success"
                        });
                    }
                    //insert or edit if
                }
                //submit
        });
});

Template.Car_edit.helpers({
    male() {
        return Template.instance().data.car.carOwner && Template.instance().data.car.carOwner.isMale?'checked':'';
    },
    female() {
        return Template.instance().data.car.carOwner && Template.instance().data.car.carOwner.isMale ? '' :'checked';
    },
    car() {
        return Template.instance().data.car;
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
