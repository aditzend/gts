import { Meteor } from 'meteor/meteor';

///server
import '/imports/startup/server';

import {
    Accounts 
} from 'meteor/accounts-base';
   
if (Meteor.isServer) {
    Meteor.startup(() => {
        // Meteor.call("updateLubritodoSalesFile")
        // Meteor.call("updateSalesFile")

        process.env.MAIL_URL = Meteor.settings.mailgun.url;
        Meteor.setInterval(() => Meteor.call("checkEmailJobs"), 60 * 1000);
        // Meteor.setInterval(() => Meteor.call("updateEmailFile"), 10 * 1 * 1000);
    });
}
