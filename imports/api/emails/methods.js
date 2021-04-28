// import { Email } from 'meteor/email';
import { Mailgun } from "meteor/risul:mailgun";

import thankPurchase from "./templates/thankPurchase"
import renewalNotice from "./templates/renewalNotice"




Meteor.methods({
  "email.test"(id) {
    console.log(id);
    return "test";
  },
  sendThankYouEmail(email, givenName, family, owner) {
    console.log("sending thank you email");
    if (Meteor.isServer) {
      const styledGivenName =
        givenName.charAt(0) + givenName.slice(1).toLowerCase();
      const ownerData = Meteor.settings.owners[owner]
      const from = `${owner} <${ownerData.email}>`
      const text = thankPurchase(
        styledGivenName,
        family,
        owner,
        ownerData.formalName,
        ownerData.facebookPage,
        ownerData.site,
        ownerData.facebookReviewsPage,
        ownerData.email,
        ownerData.description,
        ownerData.address,
        ownerData.attentionSchedule
      )
      const destinationEmail = Meteor.settings.environment === "PRODUCTION" ? email : Meteor.settings.testingEmail
      const data = {
        from: from,
        to: destinationEmail,
        subject: "Gracias por tu compra!",
        text: text
      };
      console.log(data)
      Mailgun.messages().send(
        data,
        Meteor.bindEnvironment((error, body) => {
          if (error) {
            console.log(`error sending ${error}`);
          }
        })
      );
    }
  },
  sendMailgun(jobId, data) {
    console.log('sendMailgun')
    console.log(data)
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
        } else {
          Emails.update({ _id: jobId }, { $set: { status: "SENT" } });
        }
      })
    );
  },
  saveEmailJob(email, givenName, family, dueDate, owner, sale) {

    console.log("SAVING EMAIL JOB");
    const destinationEmail = Meteor.settings.environment === "PRODUCTION" ? email : Meteor.settings.testingEmail

    Emails.insert({
      email: destinationEmail,
      givenName: givenName,
      family: family,
      dueDate: dueDate,
      owner: owner,
      sale: sale,
      status: "STORED",
      type: "SALE"
    });


  },
  checkEmailJobs() {
    console.log('CHECKING EMAIL JOBS')
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

      const ownerData = Meteor.settings.owners[j.owner]
      const from = `${j.owner} <${ownerData.email}>`
      const destinationEmail = Meteor.settings.environment === "PRODUCTION" ? j.email : Meteor.settings.testingEmail
      const styledGivenName =
        j.givenName.charAt(0) + j.givenName.slice(1).toLowerCase();
      // const from =
      //   j.owner === "Gomatodo"
      //     ? "Gomatodo <info@gomatodo.com>"
      //     : "Lubritodo <info@lubritodo.com>";
      console.log(
        `sending email to  ${styledGivenName} , sale id ${j.sale} and email id ${j._id
        }`
      );
      console.log(`Now is  ${now}`);
      // let text = renewalNotice(j.givenName, j.family)
      const text = renewalNotice(
        styledGivenName,
        j.family,
        j.owner,
        ownerData.formalName,
        ownerData.facebookPage,
        ownerData.site,
        ownerData.facebookReviewsPage,
        ownerData.email,
        ownerData.description,
        ownerData.address,
        ownerData.attentionSchedule
      )
      const data = {
        from: from,
        to: destinationEmail,
        subject: "Aviso de recambio!",
        text: text
      };
      Meteor.call("sendMailgun", j._id, data);
      console.log('mailgun called')
      Sales.update({ _id: j.sale }, { $set: { status: "EXPIRED" } });
    });
  }
});
