import "./family-show.html";

Template.Family_show.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.setDefault({
    });
});

Template.Family_show.events({
    'click .js-delete': function(e) {
        console.log(`id >>> ${e.target.id}`)
        Meteor.call('families.remove', e.target.id)
    },
    // 'click .js-delete': function(e, instance) {
    //     instance.data.onDelete(e.target.id);
    // },
    'click .js-edit': function(e,instance) {
        instance.data.onEdit(instance.data.item._id);
    }
})