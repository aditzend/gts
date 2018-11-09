import { Meteor } from 'meteor/meteor';
import mysql from 'mysql';

const conn = function () {
    console.log("connecting to sql db");
    const promise = new Promise(function (resolve, reject) {
        const connection = mysql.createConnection({
            host: 'serabey.com',
            user: 'alexa176_gtsusr',
            password: 'SGxIvRe0Q8-z',
            database: 'alexa176_gts',
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