import { Meteor } from 'meteor/meteor';

///server
import '/imports/startup/server';

import {
    Accounts
} from 'meteor/accounts-base';
   
if (Meteor.isServer) {
    Meteor.startup(() => {
        process.env.MAIL_URL = Meteor.settings.mailgun.url;
        Meteor.setInterval(() => Meteor.call("checkEmailJobs"), 1 * 1000);
        // Meteor.setInterval(() => Meteor.call("updateEmailFile"), 5 * 60 * 1000);
    });
}
