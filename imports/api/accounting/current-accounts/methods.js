//current account methods
Meteor.methods({
  createCurrentAccountItem(
    origin,
    destiny,
    invoiceId,
    grandTotal,
    taxTotal,
    dueDate,
    paymentMethodDays
  ){
    const itemId = CurrentAccountItems.insert({
      origin: origin,//the company that will receive money
      destiny: destiny,//the company that must pay
      invoice: invoiceId,
      grandTotal: grandTotal,
      rem: grandTotal,
      taxTotal: taxTotal,
      dueDate: dueDate,
      paymentMethodDays: paymentMethodDays,
      open: true,
      applications: []
    });
    console.log("NEW CURRENT ACCOUNT ITEM", itemId);

    return itemId;

  },
  assignPayment(caiId, paymentId, paymentAmount) {
    console.log('assigning payment to cai', caiId);
    console.log('assigning payment id', paymentId);
    console.log('assigning payment amount', paymentAmount);
    let cai = CurrentAccountItems.findOne(caiId);
    let payment = Payments.findOne(paymentId);
    if (payment.amount > cai.rem) {
      //push assignment to history of assignments in payment

    }
    CurrentAccountItems.update(caiId,{
        $push:{
          history:{
            payment: paymentId,
            amount: paymentAmount
          }
        }
    });
    Payments.update(paymentId,{
      $set:{
        assignedTo:caiId
      }
    });
    //this method is not robust, you need to check if
    // the amount paid is less or equal to the remainder of the cai
    // before calling
    CurrentAccountItems.update(caiId,{
      $inc:{
        rem: paymentAmount * -1
      }
    });
    // let cai = CurrentAccountItems.findOne(caiId);
    if (cai.rem <= 0) {
      CurrentAccountItems.update(caiId,{
        $set:{
          open: false
        }
      });
    }
  }
})
