import { Meteor } from 'meteor/meteor';

///server
import '/imports/startup/server';

import {
    Accounts
} from 'meteor/accounts-base';
   
if (Meteor.isServer) {
    Meteor.startup(() => {
        process.env.MAIL_URL = Meteor.settings.mailgun.url;
        Meteor.setInterval(() => Meteor.call("checkEmailJobs"), 60 * 1000);
        Meteor.call("updateEmailFile");
    });
}
