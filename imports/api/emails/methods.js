// import { Email } from 'meteor/email';
import { Mailgun } from "meteor/risul:mailgun";

import thankMailGomatodo from "./templates/thankMailGomatodo"
import thankMailLubritodo from "./templates/thankMailLubritodo"
import renewalNotice from "./templates/renewalNotice"
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
  "email.test"(id) {
    console.log(id);
    return "test";
  },
  sendThankYouEmail(email, givenName, family, owner) {
    console.log("sending thank you email");
    const from =
      owner === "Gomatodo"
        ? "Gomatodo <info@gomatodo.com>"
        : "Lubritodo <info@lubritodo.com>";

    const styledGivenName =
      givenName.charAt(0) + givenName.slice(1).toLowerCase();

    const gomatodoText = thankMailGomatodo(styledGivenName,family)

    const lubritodoText = thankMailLubritodo(styledGivenName,family)

    const text = owner === "Gomatodo" ? gomatodoText : lubritodoText;

    const data = {
      from: from,
      to: email,
      subject: "Gracias por tu compra!",
      text: text
    };
    Mailgun.messages().send(
      data,
      Meteor.bindEnvironment((error, body) => {
        if (error) {
          console.log(`error sending ${error}`);
        }
      })
    );
  },
  sendMailgun(jobId, data) {
    Mailgun.messages().send(
      data,
      Meteor.bindEnvironment((error, body) => {
        if (error) {
          console.log(`error sending ${error}`);
          Emails.update(
            {
              _id: jobId
            },
            {
              $set: {
                status: "ERROR"
              }
            }
          );
        }
        Emails.update({ _id: jobId }, { $set: { status: "SENT" } });
      })
    );
  },
  saveEmailJob(email, givenName, family, dueDate, owner, sale) {
    console.log("SAVING EMAIL JOB");
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
      const from =
        j.owner === "Gomatodo"
          ? "Gomatodo <info@gomatodo.com>"
          : "Lubritodo <info@lubritodo.com>";
      console.log(
        `sending email to  ${j.givenName} , sale id ${j.sale} and email id ${
          j._id
        }`
      );
      console.log(`Now is  ${now}`);
      let text = renewalNotice(j.givenName, j.family)
      const data = {
        from: from,
        to: j.email,
        subject: "Aviso de recambio!",
        text: text
      };
      Meteor.call("sendMailgun", j._id, data);
      Sales.update({ _id: j.sale }, { $set: { status: "EXPIRED" } });
    });

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
