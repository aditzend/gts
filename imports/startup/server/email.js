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






