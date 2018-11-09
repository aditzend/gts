import Papa from 'papaparse';

import path from 'path';
// import fs from 'file-system';
let fs = require('fs');
// import ftpClient from 'ftp-client';
let Client = require('ftp');
let base = path.resolve('.');

console.log('BASE PATH :', base);
let c = new Client();
const connectionProperties = {
    host: Meteor.settings.ftp.host,
    user: Meteor.settings.ftp.user,
    password: Meteor.settings.ftp.password
};





Meteor.methods({
     'updateGomatodoSalesFile'() {
         console.log('meteor method called');
         const emails = Sales.find({
             owner: "Gomatodo"
         });
         let arr = [];
         emails.map((s) => {
             let car = Cars.findOne(s.car.id) || {
                 carOwner: {
                     givenName: 'error',
                     email: 'error'
                 }
             }
             //  console.log(`\n ${car.carOwner.givenName}`)
             //  console.log(`${car.carOwner.email}`)
             arr.push([car.carOwner.givenName, car.carOwner.email])
         });
         let csv = Papa.unparse({
             fields: ['Nombre', 'Email'],
             data: arr
         });
         let localFile = base + '/pruebas/ventas_gomatodo.csv';
         fs.writeFile(localFile, csv, (err) => {
             if (err) throw err;
         });
     },
    'updateLubritodoSalesFile'() {
        console.log('meteor method called');
         const emails = Sales.find({
             owner: "Lubritodo"
         });
         let arr = [];
         emails.map((s) => {
             let car = Cars.findOne(s.car.id) || {carOwner:{givenName: 'error', email:'error'}}
            //  console.log(`\n ${car.carOwner.givenName}`)
            //  console.log(`${car.carOwner.email}`)
            arr.push([car.carOwner.givenName, car.carOwner.email])
         });
         let csv = Papa.unparse({
             fields: ['Nombre', 'Email'],
             data: arr
         });
          let localFile = base + '/pruebas/ventas_lubritodo.csv';
          fs.writeFile(localFile, csv, (err) => {
              if (err) throw err;
          });
    },
    'updateEmailFile'() {
        c.on('ready', Meteor.bindEnvironment(() => {
            const emails = Cars.find();
            let arr = [];
            emails.map((car) => arr.push([car.carOwner.givenName, car.carOwner.email]));
            let csv = Papa.unparse({
                fields: ['Nombre', 'Email'],
                data: arr
            });
            let localFile = base + '/gts.csv';
            fs.writeFile(localFile, csv, (err) => {
                if (err) throw err;
            });
            let destinyFile = 'mails-gtsystem.csv';

            c.put(localFile, destinyFile, function (err) {
                if (err) throw err;
                console.log('csv uploaded');
                c.end();
            });
        }));

        c.connect(connectionProperties);
    }
});






