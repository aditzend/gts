import Papa from 'papaparse';

import path from 'path';
let fs = require('fs');
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
            let destinyFile = 'local-mails-gtsystem.csv';

            c.put(localFile, destinyFile, function (err) {
                if (err) throw err;
                console.log('csv uploaded');
                c.end();
            });
        }));
        c.connect(connectionProperties);
    },
    'updateLubritodoSalesFile' () {
        console.log('updating lubritodo sales file')
        c.on('ready', Meteor.bindEnvironment(() => {

            const sales = Sales.find({owner: "Gomatodo"});
            let arr = [];
            sales.map((sale) => arr.push([sale._id,
                                        sale.car.id,
                                         sale.family.id,
                                        sale.family.name,
                                        sale.dueDate,
                                        sale.createdAt,
                                        sale.owner,
                                        sale.status,
                                        sale.author
                                        ]));
            let csv = Papa.unparse({
                fields: ['_id',
                         'car.id',
                          'family.id', 
                          'family.name', 
                          'dueDate',
                           'createdAt', 
                           'owner',
                            'status',
                         'author'],
                data: arr
            });
            let localFile = base + '/localLubritodoSales.csv';
            fs.writeFile(localFile, csv, (err) => {
                if (err) throw err;
            });
            let destinyFile = 'local-sales-lubritodo-gtsystem.csv';

            c.put(localFile, destinyFile, function (err) {
                if (err) throw err;
                console.log('csv uploaded');
                c.end();
            });
        }));
        c.connect(connectionProperties);
    }

});






