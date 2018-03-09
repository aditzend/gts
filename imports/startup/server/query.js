const sqlQuery = function (connObj) {
    console.log("quering connection");
    const promise = new Promise(function (resolve, reject) {
        console.log("connection is ", connObj.conn.threadId);
        const offset = String(connObj.offset);
        const selector = 'select \
        usuarios.name_usr,\
        usuarios.email_usr,\
        usuarios.tel_movil,\
        usuarios.car_usr,\
        usuarios.modelo,\
        usuarios.kmtsyears,\
        usuarios.fecha_nac,\
            usuarios.sexo,\
            usuarios.matricula,\
            usr_pro.death_point,\
            productos.name_pro,\
            usr_pro.time_set\
        from usuarios\
        inner join usr_pro\
        on usuarios.ID_usr = usr_pro.ID_usr\
        inner join productos\
        on productos.ID_pro = usr_pro.ID_pro\
          limit 1 offset ' + offset + ' ;';
        connObj.conn.query(selector,
            function (err, rows, fields) {
                if (err) {
                    reject(err);
                } else {
                    console.log("query ok, rows returned = ", rows.length);
                    const result = { "connection": connObj.conn, "rows": rows , "owner": connObj.owner};
                    resolve(result);
                }
            });

    });
    return promise;
};

export { sqlQuery };