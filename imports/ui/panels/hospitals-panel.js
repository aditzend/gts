import './hospitals-panel.html';

Template.Hospitals_panel.onCreated( function() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    selectedHospital: false
  });
});

Template.Hospitals_panel.onRendered( function() {
  $('#datetimepicker12').datetimepicker({
      inline: true,
      sideBySide: true
  });
})


Template.Hospitals_panel.helpers({
  isthereahospitalselected() {
    const instance = Template.instance();
    return instance.state.get('selectedHospital');
  },
  hospital() {
    const instance = Template.instance();
    return Hospitals.findOne(instance.state.get('selectedHospital'));
  },
  hospitals() {
    return Hospitals.find();
  },
  sum(a,b,c){
    return a + b + c;
  }
});

Template.Hospitals_panel.events({
  "click .js-name": function(e, instance){
    instance.state.set('selectedHospital',e.target.id);
  }
});
