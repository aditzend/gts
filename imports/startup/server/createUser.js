

const createUser = (row, owner) => new Promise((resolve, reject) => {
    console.log('TCL: createUser -> row.name_pro', row.name_pro);
    Items.update({ plate:  row.matricula  }, {
        $push: { purchases: {
            familyName: row.name_pro,
            createdAt: row.time_set
            }
        }
    }, { upsert: true } );

});

export { createUser };