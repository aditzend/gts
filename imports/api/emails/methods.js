import { Email } from 'meteor/email';
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
    saveEmailJob(email,givenName,family,dueDate) {
        Emails.insert({
            email: email,
            givenName: givenName,
            family: family,
            dueDate: dueDate
        });
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
            console.log(`sending email to  ${j.givenName} and id ${j._id}`);
            let text = `Hola ${j.givenName}, te avisamos que es hora de cambiar ${j.family} \n Que tengas un excelente dia! `;
            const data = {
                  from: 'Gomatodo <info@gomatodo.com>',
                  to: j.email,
                  subject: 'Aviso de recambio!',
                  text: text
              };
            Meteor.call('sendMailgun', j._id, data);
            }
        )
    }
});
