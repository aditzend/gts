import { Meteor } from 'meteor/meteor';

///server
import '/imports/startup/server';

import {
    Accounts
} from 'meteor/accounts-base';
   
if (Meteor.isServer) {
    Meteor.startup(() => {
        process.env.MAIL_URL = Meteor.settings.MAILGUN;
        // Meteor.call("saveEmailJob", "ad@alexanderditzend.com","Tom", "Aceite y Filtro", "2018-06-22T07:00:00-03:00");
        // Email.send({
        //     to: "ad@alexanderditzend.com",
        //     from: "sendfrom@gmail.com",
        //     subject: "Example Email",
        //     text: "The contents of our email in plain text.",
        // });
    });
}
