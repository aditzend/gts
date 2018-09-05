
let oldCars = Cars.find({
    createdAt: {
        $lt: "2018-06-27T12:00:00+00:00",
    },
    purchases: {
        $ne: undefined
    }
}, {$limit: 3}).forEach((car) => {
    for (i=0;i<car.purchases.length;i++) {
    console.log(`Car :  ${car._id}\n
    Purchase # : ${i} \n
     Purchased Family : ${car.purchases[i].familyId} \n
     Purchased Moment : ${moment(car.purchases[i].createdAt).toISOString()} \n 
     Date.now() : ${Date.now()}`)
     let data = {
         car: {
             id: car._id
         },
         family: {
             id: car.purchases[i].familyId
         },
         originalCreatedAt: moment(car.purchases[i].createdAt).toISOString()
     }
     Meteor.call("sales.insertWithDate",data)

    }
})

// console.log(oldCars)