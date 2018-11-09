import { createUser } from './createUser.js';

const processRow = function (row, owner) {
    // console.log(`processing row inside`);
    createUser(row, owner);
}

Meteor.methods({
    "processRow": processRow
})