import {
    TAPi18n
} from 'meteor/tap:i18n';

import './navigation.html';
import Papa from 'papaparse';


Template.navigation.onCreated(function() {
    this.state = new ReactiveDict();
    this.autorun(() => {
        this.subscribe('userData'),
        this.subscribe('persons.own'),
        this.subscribe('sales.all'),
        this.subscribe('cars.all')
    });
});

Template.navigation.onRendered(function() {
    // Initialize metsiMenu plugin to sidebar menu
    $('#side-menu')
        .metisMenu();
});

Template.navigation.helpers({
    user() {
        return Meteor.user();
    },

    companyName(companyId) {
        const company = Companies.findOne(companyId);
        if (company) {
            return company.name;
        } else {
            return '-'
        }
    },

    userEmail() {
        const instance = Template.instance();
        if (instance.subscriptionsReady()) {
            return Meteor.user()
                .emails[0].address;
        }
    },
    relatedPerson() {
        const instance = Template.instance();
        if (instance.subscriptionsReady() && Meteor.user()
            .relatedPerson) {


            //let r = Meteor.users.findOne(Meteor.userId())
            //.relatedPerson;
            // let relatedPersonId = Rels.findOne({
            //   destiny: Meteor.userId(),
            //   type: "HAS_USER"
            // }).origin;
            ///let relatedPerson = Persons.findOne(r);
            let name = Meteor.user()
                .name;



            return (name) ?
                name :
                'Completa tus datos!';
            // return 'subscriptionsReady';

        } else {
            return "Completa tus datos!"
        }
    }


});

Template.navigation.events({
    'click .js-report': function(event, instance) {
        event.preventDefault()
        const sales = Sales.find()
        // const emails = Cars.find();
        let arr = [];
        sales.map((s) => {
            const car = Cars.findOne(s.car.id)
            console.log(`venta de ${s.owner}`)

            arr.push([
                car.plate,
                car.brand,
                car.model,
                car.year,
                car.km,
                car.origin,
                car.createdAt,
                car.author,
                car.carOwner.givenName,
                car.carOwner.lastName,
                car.carOwner.email,
                car.carOwner.isMale,
                car.carOwner.birthdate,
                car.carOwner.phone,
                s.owner,
                s.family.name,
                s.dueDate,
                s.createdAt,
                s.status,
                s.author
            ])
        });
        let csv = Papa.unparse({
            fields: [
                'Patente',
                'Marca',
                'Modelo',
                'Año',
                'Kms',
                'Origen',
                'FechaIngreso',
                'AutorIngresoAuto',
                'Nombre',
                'Apellido',
                'Email',
                'EsHombre',
                'Cumple',
                'Tel',
                'VentaDe',
                'Producto',
                'Vencimiento',
                'FechaDeCompra',
                'Estado',
                'AutorIngresoVenta'],
            data: arr
        });
        const blob = new Blob([csv], {type: "text/plain;charset=utf-8;"})
        saveAs(blob, "GTS-Reporte.csv")
        console.log('report')

    },
    'click .js-show-treasury': function() {
        BlazeLayout.render('App_body', {
            main: 'Treasury_show_page'
        });
    },
    'click .js-create-sale': function() {
        FlowRouter.go('createSale');
    },

    // Colapse menu in mobile mode after click on element
    'click #side-menu a:not([href$="\\#"])': function() {
        if ($(window)
            .width() < 769) {
            $("body")
                .toggleClass("show-sidebar");
        }
    },
    'click [data-action=logout]': function() {
        Meteor.logout();
        FlowRouter.go('login');
    },
    'click .js-show-jobs': function(e, instance) {
      console.log('show jobs baby');
    },
    'click .js-workfor': function(e, instance) {
      console.log(e.target.id);
        Session.set('job', e.target.id);



    },
    'click .js-reset': function(e, instance) {
            Accounts.sendResetPasswordEmail(Meteor.userId);
        }
        /*  'click [data-action=loginWithFacebook]': function() {
      Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'email']
      }, function(err) {
        if (err)
          console.log("ERROR LOGGING WITH FACEBOOK : ") + err.reason;
      });
}*/

});
