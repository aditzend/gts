import './car-search.html';

Template.Car_search.onCreated(function() {
  this.autorun(() => {
    // let w = workfor('item-search.js');
    let itemsSubscription = this.subscribe('cars.all');
    // let motor = Items.findOne("r5xhgepRbYKasZ6SQ");
    // this.data.motor = motor;
  });

});
Template.Car_search.helpers({
    myCars: function() {
        let cars = Cars.find();
        return cars;
    },
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
        const instance = Template.instance();
        return CarsIndex;
    },
    // insertedText: function() {
    //     const instance = Template.instance();
    //     const index = instance.data.index;
    //     let dict = index.getComponentDict();
    //     return dict.get('searchDefinition')
    //         .toUpperCase();
    // }
});

Template.Car_search.events({
    'click .js-search-result-item': function(e, instance) {
        //console.log("id elegido ", );
        instance.data.selectedItem(e.target.id);

    },
    'click .js-create-item': function(e, instance) {
        const index = instance.data.index;
        let dict = index.getComponentDict();
        let insertedText = dict.get('searchDefinition')
            .toUpperCase();
            instance.data.itemNotFound(insertedText);

    }
});
