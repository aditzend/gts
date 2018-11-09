import { isMoment } from "moment";


const createUser = (row, owner) => new Promise((resolve, reject) => {
    console.log(`in createUser`);
    Cars.upsert(
        {plate: row.matricula},
        {
            
            $set: {
                plate: row.matricula,
                brand: row.car_usr,
                year: row.modelo,
                km: row.kmtsyears,
                carOwner: {
                    givenName: row.name_usr,
                    email: row.email_usr,
                    phone: row.tel_movil,
                    gender: row.sexo,
                    birthdate: row.fecha_nac
                }
            }
        }
    );
    
    const carId = Cars.findOne({plate: row.matricula})._id
    console.log(`carId ${carId}`);

    const familyId = Families.findOne(
        {
            legacyName: row.name_pro,
            owner: row.firma_admin
         })._id
    console.log(`familyID ${familyId}`);

    const saleData = {
        car : {
            id: carId
        },
        family: {
            id: familyId
        },
        originalCreatedAt: moment(row.time_set).toISOString()
    }

// console.log(`carId : ${carId} family: ${familyId._id}`);
    console.log(`Sale created at : \n ${saleData.originalCreatedAt}`)
    Meteor.call('sales.upsertWithDate', saleData)
    
    
    console.log(`insert \n name_usr: ${row.name_usr} \n name_pro: ${row.name_pro}`)
    // Items.update({ plate:  row.matricula  }, {
    //     $push: { purchases: {
    //         familyName: row.name_pro,
    //         createdAt: row.time_set
    //         }
    //     }
    // }, { upsert: true } );

    // if (existingCarId) {
    //     console.log("CAR EXISTS", existingCarId);
        
    // }else{
    //     console.log("create car ", existingCarId)
    // }


    // Items.insert({
    //     type: "car",
    //     plate: row.matricula,
    //     owner: owner,
    //     carOwner: {
    //         givenName: row.name_usr,
    //         author: owner
    //     }
    // });
    // console.log('Inserted CAr ', row.matricula);
    // console.log('carOwner.lastName', row.name_usr);
    // console.log('carOwner.birthdate', moment(row.fecha_nac));
    // console.log("DATA OWNER : ", owner);
    resolve(row);
});

export { createUser };