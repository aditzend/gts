import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
///server
import '/imports/startup/server';

import {
    Accounts
} from 'meteor/accounts-base';

Meteor.methods({
    // async getMeteorUser() {
    //     const result = await Meteor.user();
    //     return result;
    // }
    sendEmail(to, from, subject, text) {
        check([to, from, subject, text], [String]);
        this.unblock();
        console.log("sending email", process.env.MAIL_URL);
        Email.send({  to, from, subject, text});
    }
});
