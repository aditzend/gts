import { Meteor } from 'meteor/meteor';

///server
import '/imports/startup/server';

import {
    Accounts
} from 'meteor/accounts-base';
   
if (Meteor.isServer) {
    Meteor.startup(() => {
        // process.env.MAIL_URL = Meteor.settings.mailgun.url;
        // Meteor.setInterval(() => Meteor.call("checkEmailJobs"), 60 * 1000);
        // Meteor.setInterval(() => Meteor.call("updateEmailFile"), 1 * 60 * 1000);
        // Meteor.setInterval(() => Meteor.call("updateLubritodoSalesFile"), 1 * 10 * 1000);
    });
}
