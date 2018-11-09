import { Meteor } from 'meteor/meteor';
import { sqlQuery } from "./sqlQuery.js";
import { mySQLConnect } from './mySQLConnect.js'

import "./processRow.js";


const insertInMongo = function (params) {
    console.log('TCL: parseRows -> params', params.rows[0]);
    const row = params.rows[0]
    const carId = Cars.insert({
        plate: row.matricula,
        brand: row.car_usr.split(" ")[0],
        model: row.car_usr.split(" ")[1],
        year: row.modelo,
        km: row.kmtsyears,
        carOwner: {
            givenName: row.name_usr.split(" ")[0],
            lastName: row.name_usr.split(" ")[1],
            gender: row.sexo,
            birthdate: row.fecha_nac,
            email: row.email_usr,
            phone: row.tel_movil
        },
        origin: "legacy",
        owner:"GT",
        originallyCreatedAt: row.time_set
    })
    console.log('TCL: insertInMongo -> carId', carId);
    Meteor.call('sales.insertLegacy', carId, row.ID_pro, row.time_set)

    // return params
    const promise = new Promise (function (resolve, reject) {
        // console.log("parsing rows");
        // params.rows.map(function(row) {
        //     Meteor.call("processRow", row, params.owner);
        // });
        resolve(params)
    });
    return promise;
};

const insertData = function (params) {
    sqlQuery(params)
        .then(sqlQueryRes => insertInMongo(sqlQueryRes) )
        .then(insertInMongoRes => {
        console.log('TCL: insertData -> insertInMongoRes', insertInMongoRes.offset);
            if (insertInMongoRes.offset < 360) {
                    setTimeout(function () {
                        const offset = insertInMongoRes.offset + 1;
                        const owner = insertInMongoRes.owner;
                        console.log("OFFSET", offset);
                        insertData({ "connection": insertInMongoRes.connection, "offset": offset, "owner": owner });
                    }, 1000);
                }
        })
        .then(data => console.log("\n----------------\n"))
        .catch(error => console.log("ERROR", error));
}

const importSql = function () {
    console.log('importSql Method called, this process will start importing data from remote MySQL db. Set connection data in Settings');
    mySQLConnect()
        .then( (dbConnection) => {
            insertData({ connection: dbConnection, offset: 0, owner: 'GT' })
                .then(obj => {
                console.log("startCreation finished", obj);
            })
    })
}



Meteor.methods({
    "importSql": importSql
});