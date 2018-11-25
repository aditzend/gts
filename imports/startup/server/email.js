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
    'updateSalesFile'() {
        c.on('ready', Meteor.bindEnvironment(() => {
            //testeo con ventas de lubritodo
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
            let localFile = base + '/ventas.csv';
            fs.writeFile(localFile, csv, (err) => {
                if (err) throw err;
            });
            let destinyFile = 'ventas.csv';

            c.put(localFile, destinyFile, function (err) {
                if (err) throw err;
                console.log('csv uploaded');
                c.end();
            });
        }));

        c.connect(connectionProperties);
    },
    'updateEmailFileLegacy'() {
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
    },
});






