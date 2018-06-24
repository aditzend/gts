import "./families-panel.html";
import "../components/families/families-create.js";
import "../components/families/family-show.js";

Template.Families_panel.onCreated(function() {
    this.state = new ReactiveDict();
    this.state.setDefault({
        creating: false,
        selectedFamily: false
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
    selectedFamily() {
        return Template.instance().state.get("selectedFamily");
    },
    creating() {
        return Template.instance().state.get('creating');
    },
    showFamilyArgs(selectedFamily) {
        const family = Families.findOne(selectedFamily);
        return {
            family: family,
            onEdit(id) {
                instance.state.set('editingFamily', id);
            },
            onDelete(id) {
                instance.state.set('deletingItem', id);
                swal({
                    title: "Borramos a " + family.name + "?",
                    text: "No se puede recuperar esta informacion!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Sí, borrar!",
                    cancelButtonText: "No, cancelar por favor!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                    function(isConfirm) {
                        if (isConfirm) {
                            const deleted = Families.remove(id);
                            instance.state.set('selectedFamily', false);
                            swal(family.name + "fue eliminado.", "Se borraron los datos", "success");
                        } else {
                            swal("Eliminacion cancelada!", family.name + "esta seguro :)",  "error");
                        }
                    
                    });
            }
        }
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
    "click .js-show-family": function(e, instance) {
        instance.state.set("selectedFamily", e.target.id);
    },
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