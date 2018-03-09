

const createUser = (row, owner) => new Promise((resolve, reject) => {

    Items.upsert(
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
            },
            $push: {
                purchases: {
                    familyName: row.name_pro,
                    createdAt: row.time_set
                }
            }
        }
    );
    // Items.insert({
    //     type: "car",
    //     plate: row.matricula,
    //     owner: owner,
    //     carOwner: {
    //         givenName: row.name_usr,
    //         author: owner
    //     }
    // });
    console.log('carOwner.givenName', row.name_usr);
    // console.log('carOwner.lastName', row.name_usr);
    // console.log('carOwner.birthdate', moment(row.fecha_nac));
    // console.log("DATA OWNER : ", owner);
    resolve(row);
});

export { createUser };