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

import "./families-create.html";

Template.Families_create.onRendered(function() {
    const instance = Template.instance();

    instance.$('[data-action=form]').validate({
        rules: {
            name: {
                required: true,
                minlength:2,
                maxlength: 40
            },
            exchange: {
                required: true,
                minlength: 1,
                maxlength: 6
            }
        },
        messages: {
            name: {
                required: "Falta el nombre del producto",
                minlength: "Demasiado corto",
                maxlength: "Demasiado largo"
            },
            exchange: {
                required: "Falta la tasa de recambio",
                minlength: "Demasiado corta",
                maxlength: "Demasiado larga"
            }
        },
        submitHandler: () => {
            let name = $('#nameInput').val();
            let exchange = $("#exchangeInput").val();
            let uom = $("#uomInput").val();
            let newFamily = Meteor.call('families.insert', {
                name: name,
                exchange: exchange,
                uom: uom
            });
            instance.data.onSavedData();

        }

    });

    
});

Template.Families_create.events({
    'submit form': (e, instance) => {
        e.preventDefault();
    }
})
