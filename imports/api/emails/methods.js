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
    "emails.upsertJob"(email, givenName, family, dueDate, owner, sale) {
        console.log('SAVING EMAIL JOB');
        Emails.upsert(
            {dueDate: dueDate},
            {
                $set: {
                    email: email,
                    givenName: givenName,
                    family: family,
                    dueDate: dueDate,
                    owner: owner,
                    sale: sale,
                    status: "STORED"
                }
            }
          );
    },
    checkEmailJobs() {
        let now = new Date();
        now = now.toISOString();
        let jobs = Emails.find({
            dueDate: {
                $lt: now
            },
            status: {$ne: "SENT"}
        });
        jobs.map(j => {
            const from = (j.owner === "Gomatodo") ? 'Gomatodo <info@gomatodo.com>':'Lubritodo <info@lubritodo.com>';
            console.log(`sending email to  ${j.givenName} and id ${j._id}`);
            let text = `Hola ${j.givenName}, te avisamos que es hora de cambiar ${j.family} \n Que tengas un excelente dia! `;
            const data = {
                  from: from,
                  to: j.email,
                  subject: 'Aviso de recambio!',
                  text: text
              };
            Meteor.call('sendMailgun', j._id, data);
            Sales.update({_id:j.sale}, {$set : {status:"EXPIRED"}});
            }
        )
    }
});
