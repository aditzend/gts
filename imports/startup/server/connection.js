// import { Meteor } from 'meteor/meteor';
// import mysql from 'mysql';

// const conn = function (offset) {
//     console.log("connecting to sql db");
//     const promise = new Promise(function (resolve, reject) {
//         const connection = mysql.createConnection({
//             host: '98.130.0.77',
//             user: 'pross88_gtuser',
//             password: Meteor.settings.IX_DB_PASS,
//             database: 'pross88_gtsystem',
//             insecureAuth: "true"
//         });
//         connection.connect(function (err) {
//             if (err) {
//                 reject(err.stack);
//             } else {
//                 resolve(connection);
//             }
//         });
//     });//connect
//     return promise;
// };
// export { conn };