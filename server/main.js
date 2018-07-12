import { Meteor } from 'meteor/meteor';

///server
import '/imports/startup/server';

import {
    Accounts
} from 'meteor/accounts-base';
   
if (Meteor.isServer) {
    Meteor.startup(() => {
        process.env.MAIL_URL = Meteor.settings.mailgun.url;
        Meteor.setInterval(() => Meteor.call("checkEmailJobs"), 2 * 1000);
        // Meteor.setInterval(() =>console.log('hola alex'), 1000);
        
    });
}
