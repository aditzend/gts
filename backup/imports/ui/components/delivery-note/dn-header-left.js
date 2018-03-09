import './dn-header-left.html';
Template.dnHeaderLeft.helpers({

  address() {
    let w;
    if (Meteor.user()) {
      w = wf('called from dn header left');
      let company = Companies.find(w._id);
    }
    return 'Av. Libertador 3454'
  },
  tel() {
    return '+54 11 3444 4534'
  },
  web() {
    return 'www.empresa.com.ar'
  }
})
