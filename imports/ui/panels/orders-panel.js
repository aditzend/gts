import './orders-panel.html';
import '../pages/orders-show-page.js';

Template.Orders_panel.onCreated(function() {
  this.autorun( () => {
    if(Meteor.user()){
      const w = wf('orders-panel.js');
      this.subscribe('Orders.test');
    }else{
      console.log('cannot call wf from orders-panel.js');
    }
  });
});

Template.Orders_panel.helpers({

  explain(type) {
    switch (type) {
      case 'validation_finished':
        return 'Validación finalizada'
        break
      case 'validation_started':
        return 'Validación comenzada'
        break
      case 'enrolment_finished':
        return 'Enrolamiento exitoso'
        break
      default:
        return 'Procesando...'
    }
  },
  countEnroled() {
    return Orders.find({type: 'enrolment_finished'}).count()
  },
  countAccepted() {
    return Orders.find({type: 'validation_finished', passed: true}).count()
  },
  countRejected() {
    return Orders.find({type: 'validation_finished', passed: false}).count()
  },
  clean(user) {
    return '29903390'
  },
   channel1() {
       return Orders.find({
         channel: 1
       }, {
         sort: {
           createdAt: -1
         }
       })
     },
     channel2() {
       return Orders.find({
         channel: 2
       }, {
         sort: {
           createdAt: -1
         }
       });
     },
     channel3() {
       return Orders.find({
         channel: 3
       }, {
         sort: {
           createdAt: -1
         }
       });
     },
     channel4() {
       return Orders.find({
         channel: 4
       }, {
         sort: {
           createdAt: -1
         }
       });
     },
  timeFromOrderCreation(createdAt) {
    return moment(createdAt).fromNow();
  },
  pathForOrder(id) {

      const params = {
          _id: id
      };
      const queryParams = {
          // state: 'open'
      };
      const routeName = 'showOrder';
      const path = FlowRouter.path(routeName, params, queryParams);

      return path;
  },
  pathForOrders() {

      const params = {

      };
      const queryParams = {
          // state: 'open'
      };
      const routeName = 'showOrders';
      const path = FlowRouter.path(routeName, params, queryParams);

      return path;
  },
});

Template.Orders_panel.events({
  'click .js-new-order': function(e,instance) {
        const w = wf('click new order at dashboard.js');
        Meteor.call('createOrder', w._id, function(err,res){
          if (err) {
            console.log(err);
          } else {
            const params = {
                _id: res
            };
            const queryParams = {
                // state: 'open'
            };
            const routeName = 'showOrder';
            const path = FlowRouter.path(routeName, params, queryParams);

            FlowRouter.go(path);
          }
        });
  },
  'click .js-show-order': function(e, instance) {

  }
})
