import './orders-show-page.html';

Template.Orders_show_page.onCreated(function() {
  this.autorun( () => {

    const w = workfor('autorun at orders-show-page.js');

    this.subscribe('Orders.own', w._id);
  });
});

Template.Orders_show_page.helpers({

  orders() {
    return Orders.find({channel:1},{ sort:{createdAt:-1}});
  },
  channelOne() {
    return Orders.find({channel:1},{ sort:{createdAt:-1}})
  },
  channel2() {
    return Orders.find({channel:2},{ sort:{createdAt:-1}});
  },
  channel3() {
    return Orders.find({channel:3},{ sort:{createdAt:-1}});
  },
  channel4() {
    return Orders.find({channel:4},{ sort:{createdAt:-1}});
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
  }
});
