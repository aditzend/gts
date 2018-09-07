import {
    Template
} from 'meteor/templating';

import './car-form.html';
import CarForm from './car-form.js';



Template.carForm.helpers({
    CarForm() {
        return CarForm;
    }
})

