// import { Email } from 'meteor/email';
import { Mailgun } from 'meteor/risul:mailgun';

// Meteor.methods({
// 
// 
//     sendEmail: function() {
//         //  const tasks = Tasks.find({}).fetch();
//         const emailData = {
//             mainTitle: "Bienvenido a RAIZ DISCOS",
//             //tasks: tasks,
//             unsubscribe: "http://app.raiz-discos.com/unsubscribe"
//         };
// 
//         const body = EmailGenerator.generateHtml("billing", emailData);
// 
//         Meteor.call("sendMailgunEmail",
//             "info@estudio-raiz.com",
//             "RAIZ DISCOS", ["pross888@gmail.com"],
//             "Te damos la bienvenida!",
//             body);
//     }
// })

Meteor.methods({
    'email.test' (id) {
        console.log(id);
        return 'test';
    },
    sendThankYouEmail(email, givenName, family, owner) {
        console.log('sending thank you email')
        const from = (owner === "Gomatodo") ? 'Gomatodo <info@gomatodo.com>' : 'Lubritodo <info@lubritodo.com>';

        const styledGivenName = givenName.charAt(0) + givenName.slice(1).toLowerCase()

        const gomatodoText = `¡Hola ${styledGivenName} muchas gracias por tu compra! \n Por este medio te avisaremos cuando se acerque la fecha en que debas hacer el recambio de ${family}.\nVALORAMOS TU OPINIÓN \n
        ¿Cuánto te gusta Gomatodo ?¡Agréganos a Facebook y déjanos tu opinión!(Link a Facebook: https://www.facebook.com/GomatodoGT/) \n
            SE PARTE DE LA COMUNIDAD GT \n
Registrate en nuestra web www.gomatodo.com y aprovechá nuestros descuentos exclusivos on line.\n
Gracias por confiar en nosotros.\n
        Gomatodo  \n
El mejor servicio, en menor tiempo, al mejor precio.\n
GOMATODO SRL \n
www.gomatodo.com \n
https://www.facebook.com/pg/GomatodoGT/reviews/ \n
Gomatodo es un Centro Integral de Servicios \n
Dirección: Hipólito Yrigoyen 1905, Florida(Link a Google Maps) \n
Horarios de atención: Lun a Vie de 8 a 20 hs y sábados de 8 a 14 hs.`

        const lubritodoText = `¡Hola ${styledGivenName} muchas gracias por tu compra!\n

Por este medio te avisaremos cuando se acerque la fecha en que debas hacer el recambio de ${family}.\n


VALORAMOS TU OPINIÓN\n
¿Cuánto te gusta Lubritodo ?¡Agréganos a Facebook y déjanos tu opinión!(Link a Facebook: https://www.facebook.com/LubritodoOficial/)\n

    SE PARTE DE LA COMUNIDAD GT\n
Registrate en nuestra web www.lubritodo.com y aprovechá nuestros descuentos exclusivos on line.\n

Gracias por confiar en nosotros.\n

        Lubritodo \n
El mejor servicio, en menor tiempo, al mejor precio.\n

LUBRITODO SRL\n
www.lubritodo.com\n
https://www.facebook.com/pg/LubritodoOficial/reviews/\n
info@lubritodo.com\n
Lubritodo es un Centro Integral de Lubricación\n
Dirección: Hipólito Yrigoyen 1999, Florida(Link a Google Maps: \nhttps://goo.gl/maps/1d7VaEpFzqn)\n
    Horarios de atención: Lun a Vie de 8 a 18 hs y sábados de 8 a 14 hs`



        const text = (owner === "Gomatodo") ? gomatodoText : lubritodoText;
        
        
    

        const data = {
            from: from,
            to: email,
            subject: 'Gracias por tu compra!',
            text: text,
        };
        Mailgun.messages().send(data, Meteor.bindEnvironment((error, body) => {
            if (error) {
                console.log(`error sending ${error}`);
            }
        }));
    },
    sendMailgun(jobId, data) {
        Mailgun.messages().send(data, Meteor.bindEnvironment ((error, body) => {
            if (error) {
                console.log(`error sending ${error}`);
                Emails.update({
                    _id: jobId
                }, {
                    $set: {
                        status: 'ERROR'
                    }
                });
            }
            Emails.update({_id:jobId}, {$set:{status: 'SENT'}});
        }));
    },
    saveEmailJob(email, givenName, family, dueDate, owner, sale) {
        console.log('SAVING EMAIL JOB');
        Emails.insert({
            email: email,
            givenName: givenName,
            family: family,
            dueDate: dueDate,
            owner: owner,
            sale: sale,
            status: "STORED",
            type: "SALE"
        });
        //   Emails.insert({
        //       email: email,
        //       givenName: givenName,
        //       family: family,
        //       dueDate: moment().toISOString(),
        //       owner: owner,
        //       sale: sale,
        //       status: "STORED",
        //       type: "SALE"
        //   });
    },
    checkEmailJobs() {
        let now = new Date();
        now = now.toISOString();
        let jobs = Emails.find({
            $and: [
                {
                    dueDate: { $lt: now }
                },
                {
                    status: { $ne: "SENT" }
                },
                {
                    status: { $ne: "MISSED" }
                }
            ]
        });
        jobs.map(j => {
            const from = (j.owner === "Gomatodo") ? 'Gomatodo <info@gomatodo.com>' : 'Lubritodo <info@lubritodo.com>';
            console.log(`sending email to  ${j.givenName} , sale id ${j.sale} and email id ${j._id}`);
            console.log(`Now is  ${now}`);
            let text = `Hola ${j.givenName}, te avisamos que es hora de cambiar ${j.family} \n Que tengas un excelente dia! `;
            const data = {
                from: from,
                to: j.email,
                subject: 'Aviso de recambio!',
                text: text
            };
            Meteor.call('sendMailgun', j._id, data);
            Sales.update({ _id: j.sale }, { $set: { status: "EXPIRED" } });
        }
        )
       
            // saleJobs.map(j => {
            //     const from = (j.owner === "Gomatodo") ? 'Gomatodo <info@gomatodo.com>' : 'Lubritodo <info@lubritodo.com>';
            //     console.log(`sending email to  ${j.givenName} and id ${j._id}`);
            //     let text = `Hola ${j.givenName}, muchas gracias por tu compra. Te avisamos cuando sea hora de cambiar ${j.family} \n Que tengas un excelente dia! `;
            //     const data = {
            //         from: from,
            //         to: j.email,
            //         subject: 'Gracias por tu compra!',
            //         text: text
            //     };
            //     Meteor.call('sendMailgun', j._id, data);
            // })
    }
});
