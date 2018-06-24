import {Email} from 'meteor/email';

// Meteor.methods({
// 
// 
//     sendEmail: function() {
//         //  var tasks = Tasks.find({}).fetch();
//         var emailData = {
//             mainTitle: "Bienvenido a RAIZ DISCOS",
//             //tasks: tasks,
//             unsubscribe: "http://app.raiz-discos.com/unsubscribe"
//         };
// 
//         var body = EmailGenerator.generateHtml("billing", emailData);
// 
//         Meteor.call("sendMailgunEmail",
//             "info@estudio-raiz.com",
//             "RAIZ DISCOS", ["pross888@gmail.com"],
//             "Te damos la bienvenida!",
//             body);
//     }
// })

Meteor.methods({
    sendEmail(to, from, subject, text) {
        // Make sure that all arguments are strings.
        // check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running, without
        // waiting for the email sending to complete.
        this.unblock();

        Email.send({ to, from, subject, text });
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
        let jobs = Emails.find({
            dueDate: {
                $lt: "2018-06-24T11:36:30-03:00"
            }
        });
        jobs.map(j => {
            console.log(`sending email to  ${j.givenName}`);
            let text = `Hola ${j.givenName}, te avisamos que es hora de cambiar ${j.family} \n Que tengas un excelente dia! `;
            Meteor.call('sendEmail',j.email, "gts@gts.com", "Aviso de recambio!",text);
            }
        )
    }
});
