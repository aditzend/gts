import { Meteor } from 'meteor/meteor';
import { sqlQuery } from "./query.js";
import { conn } from "./connection.js";

import "./processRow.js";


function parseRows(sqlQueryResult) {
    const promise = new Promise (function (resolve, reject) {
        console.log("parsing rows");
        sqlQueryResult.rows.map(function(row) {
            Meteor.call("processRow", row, sqlQueryResult.owner);
        });
        resolve("all parsed");
    });
    return promise;
};

function manageRow(sqlQueryResult) {
    const promise = new Promise (function(resolve, reject) {
        console.log('managing row')
        sqlQueryResult.rows.map( 
            row => {
                console.log(row.sexo)
                console.log("/n")
            }
        )
        const result = {
            "connectionData": sqlQueryResult.connectionData,
            "offset":sqlQueryResult.offset
        }
        resolve(result)
    })
    return promise
}

function startCreation(connObj) {
    sqlQuery(connObj)
    .then(manageRow)
    .then(manageRowResult => {
        if (manageRowResult.offset<360) {
            console.log('keep going ...')
            setTimeout(function() {
                const offset = connObj.offset +1;
                const owner = connObj.owner;
                console.log("OFFSET", offset);
                startCreation({"conn":connObj.conn, "offset":offset, "owner":owner});
            }, 1000);
        } else {
            manageRowResult.connectionData.end()
        }
    })
    .then(data => console.log("\n----------------\n"))
    .catch(error => console.log("ERROR", error));
}

function importSql() {
    console.log('importSql ');
    conn().then(
        c => {startCreation({ connectionData: c, offset: 360, owner: 'GT' }).then(
                obj => {console.log("startCreation finished", obj);
            });
        });
}

Meteor.methods({
    "importSql": importSql
});