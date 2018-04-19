// import {Index, MinimongoEngine } from 'meteor/easy:search'
import './car-search.html'

Template.Car_search.onCreated(function() {
  this.autorun(() => {
    let itemsSubscription = this.subscribe('cars.all');
  });

});
Template.Car_search.helpers({
    car_searchIndexAttributes: function() {
        return {
            'id': 'search-input',
            'class': 'form-control',
            'autocomplete': 'off',
            'placeholder': " 'NVF254'... ",
            'style': "text-transform:uppercase"
        };
    },
    car_searchIndex: function() {
        // const instance = Template.instance();
        return CarsIndex;
    },
    insertedText: function() {
        const instance = Template.instance();
        const index = instance.data.index;
        let dict = index.getComponentDict();
        return dict.get('searchDefinition')
            .toUpperCase();
    }
});

Template.Car_search.events({
    'click .js-search-result-item': function(e, instance) {
        //console.log("id elegido ", );
        instance.data.selectedItem(e.target.id);

    },
    'click .js-create-item': function(e, instance) {
        const index = instance.data.index;
        console.log(index);
        let dict = index.getComponentDict();
        console.log(dict);
        let insertedText = dict.get('searchDefinition')
            .toUpperCase();
            instance.data.itemNotFound(insertedText);

    }
});
