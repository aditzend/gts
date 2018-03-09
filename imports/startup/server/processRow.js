import { createUser } from './createUser.js';

const processRow = function (row, owner) {
    createUser(row, owner);
}

Meteor.methods({
    "processRow": processRow
})