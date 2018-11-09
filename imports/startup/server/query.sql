select usuarios.name_usr,
        usuarios.email_usr,
        usuarios.tel_movil,
        usuarios.car_usr,
        usuarios.modelo,
        usuarios.kmtsyears,
        usuarios.fecha_nac,
        usuarios.sexo,
        usuarios.matricula,
        usr_pro.death_point,
        productos.name_pro,
        usr_pro.time_set
        from usuarios
        inner join usr_pro
        on usuarios.ID_usr = usr_pro.ID_usr
        inner join productos
        on productos.ID_pro = usr_pro.ID_pro