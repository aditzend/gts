import { Meteor } from 'meteor/meteor';
// import { sqlQuery } from "./query.js";
// import { conn } from "./connection.js";
import Papa from 'papaparse';

// import "./processRow.js";


function parseRows(sqlQueryResult) {
    const promise = new Promise(function (resolve, reject) {
        console.log("parsing rows");
        sqlQueryResult.rows.map(function (row) {
            Meteor.call("processRow", row, sqlQueryResult.owner);
        });
        resolve("all parsed");
    });
    return promise;
};

function manageRow(sqlQueryResult) {
    const promise = new Promise(function (resolve, reject) {
        console.log('managing row')
        sqlQueryResult.rows.map(
            row => {
                console.log(row.sexo)
                console.log("/n")
            }
        )
        const result = {
            "connectionData": sqlQueryResult.connectionData,
            "offset": sqlQueryResult.offset
        }
        resolve(result)
    })
    return promise
}

function startCreation(connObj) {
    sqlQuery(connObj)
        .then(manageRow)
        .then(manageRowResult => {
            if (manageRowResult.offset < 360) {
                console.log('keep going ...')
                setTimeout(function () {
                    const offset = connObj.offset + 1;
                    const owner = connObj.owner;
                    console.log("OFFSET", offset);
                    startCreation({ "conn": connObj.conn, "offset": offset, "owner": owner });
                }, 1000);
            } else {
                manageRowResult.connectionData.end()
            }
        })
        .then(data => console.log("\n----------------\n"))
        .catch(error => console.log("ERROR", error));
}

function csvParse() {
    const csv = Assets.getText('query_result.csv');
    console.log('parsing csv ');
    Papa.parse(csv, {
        header:true,
        step: function (row) {
            const d = row.data[0]
            // console.log("Row:", d)
            const isMale = d.sexo == "hombre"? true: false
            let brand = d.car_usr
            let model = d.car_usr
            let plate = d.matricula
            const purchaseDate = moment(d.purchase_date)
        

            if (d.car_usr) {
                brand = brand.split(" ")[0].toUpperCase()
                model = model.split(" ")[1]? model.split(" ")[1].toUpperCase() : null
            }

            let givenName = d.name_usr
            let lastName = d.name_usr
            if (d.name_usr) {
                givenName = givenName.split(" ")[0].toUpperCase()
                lastName = lastName.split(" ")[1]? lastName.split(" ")[1].toUpperCase() : null
            }

            
            // const brand = d.car_usr? d.car_usr.split(" ")[0].toUpperCase():""
            // const model = d.car_usr ? car_usr_copy.split(" ")[1].toUpperCase():""
            const createdAt = d.time_set

            if ( plate !== null && plate !== "" && plate !== undefined) {
                plate = plate.toUpperCase()
                console.log('inserting car')
                Cars.upsert({
                    plate: plate,
                }, {
                        $set: {
                            plate: plate,
                            brand: brand,
                            model: model,
                            year: d.modelo,
                            km: d.kmtsyears,
                            createdAt: createdAt,
                            carOwner: {
                                givenName: givenName,
                                lastName: lastName,
                                email: d.email_usr,
                                phone: d.tel_movil,
                                birthdate: d.fecha_nac,
                                isMale: isMale,
                            },
                            origin: "legacy",
                            owner: "GT",
                            author: "SCRIPT"
                        }
                    })
                let family = Families.findOne({ n: Number(d.familyID) })
                let car = Cars.findOne({ plate: plate })
                const data = {
                    car: {
                        id: car._id,
                    },
                    family: {
                        id: family._id,
                    },
                    dkm: d.daily_km,
                    originalCreatedAt: purchaseDate,
                }
                Meteor.call('sales.insertWithDateAndDkm', data)
            } else {
                console.log(plate)
            }
        },
        complete: function () {
            console.log("All done!");
        }
    })
}

Meteor.methods({
    "csvParse": csvParse
});