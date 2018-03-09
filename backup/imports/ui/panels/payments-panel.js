import './payments-panel.html';

Template.Payments_panel.onCreated( function(){
  this.state = new ReactiveDict();
    this.autorun( () => {
      if (Meteor.user()) {
        const w = wf('payments-panel.js');
        let CurrentAccountItemsSubscription =
        this.subscribe(
          'CurrentAccountItems.origin',
          w._id
        );
      }else{
        console.log('cannot call wf from payment panel');
      }
    });
  this.state.setDefault({
    companyId: false,
    companyName: false,
    fin:false,
    finType:false,
    cai:false,
    showAllPending:false,
    showAutoAssign: false
  });
});

Template.Payments_panel.helpers({
  CurrentAccountStatus() {
    const instance = Template.instance();
    let companyCais = CurrentAccountItems.find({
      destiny:instance.state.get('companyId'),
      open: true});
    let companyPayments = Payments.find({
      origin:instance.state.get('companyId'),
      assignedTo:false
    });
    let caiSum = 0;
    let paymentSum = 0;
    companyPayments.forEach(function(p) {
      paymentSum += p.amount;
      // console.log('REM', c.rem);
    });
    companyCais.forEach(function(c) {
      caiSum += c.rem;
      // console.log('REM', c.rem);
    });
    return numeral(caiSum - paymentSum).format('$0,0.00');
  },
  qtyCaisOpen() {
    const instance = Template.instance();
    let companyCais = CurrentAccountItems.find({
      destiny:instance.state.get('companyId'),
      open: true});
    return companyCais.count();
  },
  diff(alfa,bravo) {
    const instance = Template.instance();
    let a = Number(alfa);
    let b = Number(bravo) | 0;
    let diff = a - b;
    let cai = CurrentAccountItems.findOne(instance.state.get('cai'));
    CurrentAccountItems.update(instance.state.get('cai'),{$set:{rem:diff}});
    if (diff <= 0) {
      let cai = CurrentAccountItems.findOne(instance.state.get('cai'));
      console.log('update open');
      CurrentAccountItems.update(instance.state.get('cai'),{$set:{open:false}});
      Invoices.update(cai.invoice,{$set:{paid:true}});
      console.log('invoice paid', cai.invoice);
    }
    return diff;
  },
  showAutoAssign() {
    const instance = Template.instance();
    let unassignedPayments = Payments.find({
      origin:instance.state.get('companyId'),
      assignedTo:false
    });
    return (unassignedPayments.count() === 0)? false: true;
  },
  unassignedPayments() {
    const instance = Template.instance();
    return Payments.find({
      origin:instance.state.get('companyId'),
      assignedTo:false
    });
  },
  sumOfPayments() {
    const instance = Template.instance();
    let cai = CurrentAccountItems.findOne(instance.state.get('cai'));
    let H = cai.history;
    let sum = 0;
    for (i=0; i<H.length; i++) {
      let payment = H[i];
      sum += Number(payment.amount);
    }
    return sum
  },
  companyArgs() {
    const instance = Template.instance();
    return {
      mode: 'customer',
      params: 'show-details',
      index: CompaniesIndex,
      onDECS_selectedCompany(id,name,fin,finType) {
        console.log('selected company', id);
        instance.state.set('companyId',id);
        instance.state.set('companyName',name);
        instance.state.set('fin',fin);
        instance.state.set('finType',finType);
      }
    }
  },
  cai() {
    const instance = Template.instance();
    return CurrentAccountItems.findOne(
            instance.state.get('cai')
    );
  },
  caiSelected() {
    const instance = Template.instance();
    return instance.state.get('cai');
  },
  cais() {
    const instance = Template.instance();
    return CurrentAccountItems.find({
      destiny: instance.state.get('companyId'),
      open:true
    });
  },
  companyName() {
    const instance = Template.instance();
    return instance.state.get('companyName');
  },
  selectedCompany() {
    const instance = Template.instance();
    return instance.state.get('companyId');
  },
  showAllPending() {
    const instance = Template.instance();
    return instance.state.get('showAllPending');
  },
  allPending() {
    return CurrentAccountItems.find({open:true},{$order:{createdAt:1}});
  }
});
Template.Payments_panel.events({
  'click .js-auto-assign': function(e,instance) {
    console.log("auto assign payments");
    //get the oldest cai and the oldest payment
    let cais = CurrentAccountItems.find({open:true,destiny:instance.state.get('companyId')},{$sort:{dueDate:-1}});
    let C = [];
    let pos = 0;
    cais.forEach(function(cai){
      C[pos] = {_id:cai._id, rem: cai.rem };
      pos++;
    });
    pos = 0;
    console.log("array : " , C);
    let payments = Payments.find({assignedTo:false, origin:instance.state.get('companyId')},{$sort:{createdAt:-1}});
    let P = [];
    payments.forEach(function(payment){
      P[pos] = {_id:payment._id, amount: payment.amount};
      pos++;
    });
    console.log("---PAYMENTS---");
    console.log(P);
    //if there are no cais, do nothing there is nothing to assign
    if (C.length === 0) {
      console.log("NO CAIS TO ASSIGN");
    }else{
      //either the payment is less,equal or greater than this cai
      console.log("first items", C[0].rem);
      for (i=0;i<P.length;i++){
        console.log("payment" + i + P[i].amount );
        if (P[i].amount <= C[0].rem) {
          Meteor.call('assignPayment',C[0]._id,P[i]._id,P[i].amount);

            // CurrentAccountItems.update(C[0]._id,{$push:{
            //   history: {
            //     payment:P[i]._id,
            //     type:P[i].type,
            //     amount:P[i].amount
            //    }
            // }});
            // CurrentAccountItems.update(C[0]._id,{$inc:{
            //   rem: P[i].amount * -1
            // }});
        }

      };

      //if its less, add payment to history and update rem

    }


    //if its equal, same but set payment and cai to close
    //if its greater look for the next payment and add the diff to its history
    //if there is no other payment, set the diff as unassigned payment

  },
  'submit .js-receive-payment': function(e,instance) {
    let w = wf('Payments_panel');
    e.preventDefault();
    Payments.insert({
      origin: instance.state.get('companyId'),
      destiny: w._id,
      assignedTo: false,
      type: e.target.type.value,
      amount: e.target.amount.value
    });
    // CurrentAccountItems.update(instance.state.get('cai'),{$push:{
    //   history: {
    //     type:e.target.type.value,
    //     amount:e.target.amount.value
    //    }
    // }});
    e.target.type.value = '';
    e.target.amount.value = '';


    console.log(e.target.type.value);
    console.log(e.target.amount.value);
  },
  // 'submit form': function(e,instance) {
  //   e.preventDefault();
  //   Payments.insert({
  //     destiny: instance.state.get('companyId'),
  //     type: e.target.type.value,
  //     amount: e.target.amount.value * -1
  //   });
  //   CurrentAccountItems.update(instance.state.get('cai'),{$push:{
  //     history: {
  //       type:e.target.type.value,
  //       amount:e.target.amount.value
  //      }
  //   }});
  //   e.target.amount.value = '';
  // },
  'click .js-cai': function(e,instance) {
    instance.state.set('cai',e.target.id);
    console.log('cai target', e.target.id);
  },
  'click .js-back-to-search': function(e,instance) {
    instance.state.set('companyId',false);
  },
  'click .js-show-all-pending': function(e,instance) {
    instance.state.set('showAllPending',true);
  },
  'click .js-hide-all-pending': function(e,instance) {
    instance.state.set('showAllPending',false);
    // console.log(instance.state.get('showAllPending'));
  }
})
