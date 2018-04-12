import { Meteor } from 'meteor/meteor';
import mysql from 'mysql';

const conn = function (offset) {
    console.log("connecting to sql db");
    const promise = new Promise(function (resolve, reject) {
        const connection = mysql.createConnection({
            host: '98.130.0.77',
            user: 'pross88_gtreader',
            password: 'Tld,al730ml.',
            database: 'pross88_gtsystem',
            insecureAuth: "true"
        });
        connection.connect(function (err) {
            if (err) {
                console.log("cannot conenct to db", err.stack);
                reject(err.stack);
            } else {
                console.log('connected to db');
                resolve(connection);
            }
        });
    });//connect
    return promise;
};
export { conn };