import { Meteor } from 'meteor/meteor'
import mysql from 'mysql'
// console.log('TCL: mySQLConnect -> Meteor.settings.mysql.host', Meteor.settings.mysql.host);

const mySQLConnect = function () {
    const promise = new Promise(function (resolve, reject) {
        const connection = mysql.createConnection({
            host: Meteor.settings.mysql.host,
            user: Meteor.settings.mysql.user,
            password: Meteor.settings.mysql.password,
            database: Meteor.settings.mysql.database
            // insecureAuth: "true"
        });
        connection.connect(function (err) {
            if (err) {
                console.log("cannot connect to db", err.stack);
                reject(err.stack);
            } else {
                // console.log('TCL: mySQLConnect -> connection', connection);
                resolve(connection);
            }
        });
    });//connect
    return promise;
};
export { mySQLConnect };



