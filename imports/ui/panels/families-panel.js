import "./families-panel.html";
import "../components/families/families-create.js";

Template.Families_panel.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.setDefault({
        creating: false
    });
    this.autorun(() => {
        this.subscribe("userData");
        if (Meteor.user()) {
            this.subscribe("families.own", Meteor.user().name);
        }
       
    });
}
);


Template.Families_panel.helpers({
    families() {
        return Families.find();
    },
    creating() {
        return Template.instance().state.get('creating');
    },
    createFamilyArgs() {
        const instance = Template.instance();
        return {
            onSavedData() {
                swal({
                    title: 'Excelente',
                    text: 'Se guardaron los datos',
                    type: 'success'
                });
                instance.state.set('creating', false);
                
            }
        }        
    }
    ,
    editCompanyArgs(id) {
        const instance = Template.instance();
        const company = Companies.findOne(id);
        return {
            company: company,
            onSavedData() {
                instance.state.set('editingCompany', false);

            },
            onCancel() {
                instance.state.set('editingCompany', false);

            }

        }
    },
});

Template.Families_panel.events({
    "click .js-add-family": function(e, instance) {
        instance.state.set('creating', true);
    },
    "click .js-cancel-create": function(e, instance) {
        instance.state.set('creating', false);
        swal({
            title: 'Cancelado',
            text: 'No se guardaron los datos',
            type: 'warning'
        });
    }
});