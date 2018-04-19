
import './car-decs.html';
import './car-search.js';
import './car-show.js';
import './car-edit.js';


Template.Car_DECS.onCreated(function() {
    this.autorun(() => {
    //   const w = workfor('item motor decs.js');
        // this.subscribe('items.own', w._id);
        this.subscribe('cars.all');
    });

    this.state = new ReactiveDict();
    this.state.setDefault({
        selectedItem: false,
        creatingItem: false,
        editingItem: false,
        itemCreated: false,
        creatingItem: false,
        editingItem: false,
        deletingItem: false,

    });
});

//vvvvvvvvvvvvvv ARGS vvvvvvvvvvvvvv
Template.Car_DECS.helpers({
  // pathForLabel() {
  //   const routeName = 'printLabels',
  //   const params
  //   const path = FlowRouter.path(routeName, params, queryParams);
  //   return path;
  // },

  showArgs(id) {
      const car = Items.findOne({_id: id});
      return {
          carId: id,
          plate: car.plate,
          brand: car.brand,
          model: car.model,
          year: car.year,
          km: car.km,
          purchases: car.purchases,
          carOwner: car.carOwner

      }
  },

    searchItemArgs() {
        const instance = Template.instance();

        return {
            //mode: 'product',
            mode: instance.data.mode,
            index: CarsIndex,
            selectedItem(id) {
                instance.state.set('selectedItem', id);
                console.log("STATE>>>>>>>>>>>>>> SELECTED Item ", id);
            },
            itemNotFound(insertedText) {
                instance.state.set('creatingItem', insertedText);
                console.log("creatingItem", insertedText);

            }
        }
    },
    // showthis() {
    //     return {
    //         foo: 'bar'
    //     }
    // },
    showItemArgs(selectedItemId) {
        const instance = Template.instance();
        const item = Items.findOne(selectedItemId);
        instance.data.selectedItemName(item.name);
        instance.data.selectedItemDesc(item.desc);

        instance.data.selectedItemProfitCenter(item.profitCenter);

        instance.data.selectedItemId(selectedItemId);

        return {
            foo: "bar",
            item: item,

            onEdit(itemId) {
                instance.state.set('editingItem', itemId);
                // console.log('EDIT CONTACT REL ', relId);
            },
            onDelete(itemId) {
                instance.state.set('deletingItem', itemId);
                // console.log('DELETE CONTACT REL ', relId);
                swal({
                        title: "Borramos a " + item.name + ' ?',
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
                            const deleted = Items.remove(itemId);
                            instance.state.set('selectedItem', false);
                            swal(item.name + " fue eliminada.", "Se borraron los datos", "success");
                        } else {
                            swal("Eliminación cancelada!", item.name + " esta segura :)", "error");
                        }
                    });

            }
        }
    },
    editItemArgs(id) {
        const instance = Template.instance();
        const item = Items.findOne(id);
        return {
            item: item,
            onSavedData() {
                instance.state.set('editingItem', false);

            },
            onCancel() {
                instance.state.set('editingItem', false);

            }

        }
    },
    showVendorRelArgs(itemId) {
        const instance = Template.instance();
        const rel = Rels.findOne({
            type: 'vendor',
            origin: itemId,
            destiny: HARDCODE_OWNER
        });
        return {
            rel,
            onEdit(relId) {
                instance.state.set('editingVendorRel', relId);
                // console.log('EDIT CONTACT REL ', relId);
            }
        }

    },
    editVendorRelArgs(itemId) {
        const instance = Template.instance();

        return {
            type: 'vendor',
            origin: itemId,
            destiny: HARDCODE_OWNER,
            onSavedData(relId) {
                instance.state.set('createdRel', relId);
                instance.state.set('editingVendorRel', false);

            },
            onCancel() {
                instance.state.set('editingVendorRel', false);
                console.log('Cancelado');
            }
        }
    },
    createCarArgs() {
        const instance = Template.instance();
        console.log("item name", instance.state.get('creatingItem'));

        return {
            car: {
                plate: instance.state.get('creatingItem')
            },
            onSavedData(newItem) {
                instance.state.set('creatingItem', false);
                instance.state.set('selectedItem', newItem);

            },
            onCancel() {
                instance.state.set('creatingItem', false);

            }
        }
    },

    editCarArgs(carId) {
        const instance = Template.instance();
        const car = Cars.findOne(carId);
        return {
            car: car,
            onSavedData() {
                // console.log('rel created contact', relId);
                instance.state.set('editingItem', false);
                instance.state.set('creatingItem', false);

            },
            onCancel() {
                // console.log('cancel');
                instance.state.set('editingItem', false);
                instance.state.set('creatingItem', false);

            }
        }
    },

});
//vvvvvvvvvvvvvv STATE vvvvvvvvvvvvvv
Template.Car_DECS.helpers({
  
    editingItem() {
        const instance = Template.instance();
        return instance.state.get('editingItem');
    },

    selectedItem() {
        const instance = Template.instance();
        const item = instance.state.get('selectedItem');
        return item;
    },
    creatingItem() {
        const instance = Template.instance();
        return instance.state.get('creatingItem');
    },
    itemCreated() {
        const instance = Template.instance();
        return instance.state.get('itemCreated');
    },
    creatingItem() {
        const instance = Template.instance();
        return instance.state.get('creatingItem');
    },
 
 
});
//vvvvvvvvvvvvvv HELPERS vvvvvvvvvvvvvv
Template.Car_DECS.helpers({
    rel(item) {
        const rel = Rels.findOne({
            type: 'vendor',
            origin: item,
            destiny: HARDCODE_OWNER
        });
        return rel;
    },
    contactRels(item) {
        const rels = Rels.find({
            type: 'contact',
            // origin: item,
            destiny: item
        });
        return rels;
    },
    placeRels(item) {
        const rels = Rels.find({
            type: 'place',
            // origin: item,
            destiny: item
        });
        return rels;
    }
});

Template.Car_DECS.events({
    'click .js-deselect-item': function(e, instance) {
        instance.state.set('selectedItem', false);
    },
    'click .js-rel-vendor-edit': function(e, instance) {
        instance.state.set('editingVendorRel', true);
    },
    'click .js-item-edit': function(e, instance) {
        instance.state.set('editingItem', true);
    },
    'click .js-contact-create': function(e, instance) {
        instance.state.set('creatingItem', true);
    },
    'click .js-place-create': function(e, instance) {
        instance.state.set('creatingPlace', true);
    },
    'click .js-confirm-deletion': function(e, instance) {
        const relId = instance.state.get('deletingItemRel');
        console.log('delete confirmed ', relId);

    },
    'click .js-cancel-deletion': function(e, instance) {
        instance.data.onEdit(instance.data.relId);
    },
    'click .js-delete': function(e, instance) {
        console.log("delete ", e.target.id);
        swal({
            title: "Estas seguro?",
            text: "No se puede recuperar esta informacion!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, borrarlo!",
            cancelButtonText: "No, cancelar por favor!",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {

                    const deleted = Cars.remove(e.target.id);
                    console.log('deleted', deleted);


                    swal("Eliminado!", "Este auto fue eliminado.", "success");
                } else {
                    swal("Cancelado", "Este auto esta seguro :)", "error");
                }
            });
    },
    'click .js-edit': function(e, instance) {
        console.log("edit ", e.target.id);
        instance.state.set('editingItem', true);
        console.log("editingItem", instance.state);
    }
});
