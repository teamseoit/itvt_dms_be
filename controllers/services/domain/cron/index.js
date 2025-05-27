const cron = require('node-cron')
const CronDomainServices = require("../../../../models/services/domain/model_cron");
const Emailers = require("../../../emailers/index");

// cron.schedule('* * * * *', () => {
//   // 7h sáng, theo múi h 0
//   // getCronDomainServicesExpired()
//   // Emailers
// }).start()

async function getCronDomainServicesExpired() {
  try {
    var currentDate = new Date();

    const [
      data,
      data_update
    ] = await Promise.all([
      CronDomainServices.find({expiredAt: {$lte: currentDate}}).sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_id', 'name company'),

        CronDomainServices.updateMany({expiredAt: {$lte: currentDate}},{
        $set: {
          status: 3
        }      
      })
    ])

    data.forEach(item =>{
      item.status = 3
    })
    console.log(data);
  } catch (error) {
    console.error(error)
  }
}