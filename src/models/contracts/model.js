const mongoose = require("mongoose");
const logAction = require("../../middleware/actionLogs");

const contractSchema = new mongoose.Schema({
  contract_code: {
    type: String,
    required: true,
    unique: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers"
  },
  total_price: {
    type: Number,
    default: 0
  },
  deposit_amount: {
    type: Number,
    default: 0
  },
  remaining_cost: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 0
  },
  export_vat: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    default: null
  }
}, {timestamps: true});

let Contracts = mongoose.model("Contracts", contractSchema);
module.exports = Contracts;

function roundToNearestThousand(number) {
  return Math.round(number / 1000) * 1000;
}

const addZero = (number) => {
	return number < 10 ? '0' + number : number;
}

const format_date = (str_date, str_format = 'YYYY-MM-dd') => {
	const date = new Date(str_date);
	if (!str_date || date == 'Invalid Date') return str_date

	const year = date.getFullYear();
	const month = addZero(date.getMonth() + 1);
	const day = addZero(date.getDate());

	const hour = addZero(date.getHours());
	const minutes = addZero(date.getMinutes());
	const seconds = addZero(date.getSeconds());

	str_format = str_format
    .replace('YYYY', year)
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('hh', hour)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('YY', year.toString().substring(1,3))
    .replace('yy', year.toString().substring(1,3))
	return str_format;
}

Contracts.createCode = async () =>{
  try {
    const count = await Contracts.estimatedDocumentCount();
    const str_code = `HD_${format_date(new Date(), "DDMMYYHHmmss")}${count}`;
    const check = await Contracts.countDocuments({contract_code: str_code});
    if(check > 0) return await Contracts.createCode()
    return str_code;
  } catch (error) {
    console.log(error);
    return null;
  }
}

Contracts.create_or_update_contract = async (customer_id) => {
  try {
    let total_price = 0;
    let deposit_amount = 0;
    let remaining_cost = 0;
    let status = 0;

    // domain
    const ModelDomain = require('../../models/services/domain/model');
    const data_domain = await ModelDomain.find({customer_id:customer_id}).populate('domain_plan_id').exec();
    data_domain.forEach(item => {
      if (item.domain_plan_id && item.domain_plan_id.price) {
        total_price += item.domain_plan_id.price * item.periods;
      }
    });

    // hosting
    const ModelHosting = require('../../models/services/hosting/model')
    const data_hosting = await ModelHosting.find({customer_id:customer_id}).populate('hosting_plan_id').exec();
    data_hosting.forEach(item => {
      if (item.hosting_plan_id && item.hosting_plan_id.price) {
        total_price += roundToNearestThousand(item.periods * 12 * item.hosting_plan_id.price);
      }
    });
    
    // email
    const ModelEmail = require('../../models/services/email/model')
    const data_email = await ModelEmail.find({customer_id:customer_id}).populate('email_plan_id').exec();
    data_email.forEach(item => {
      if (item.email_plan_id && item.email_plan_id.price) {
        total_price += roundToNearestThousand(item.periods * 12 * item.email_plan_id.price);
      }
    });
    
    // ssl
    const ModelSsl = require('../../models/services/ssl/model')
    const data_ssl = await ModelSsl.find({customer_id:customer_id}).populate('ssl_plan_id').exec();
    data_ssl.forEach(item => {
      if (item.ssl_plan_id && item.ssl_plan_id.price) {
        total_price += item.periods * item.ssl_plan_id.price;
      }
    });
    
    // website
    const ModelWebsite = require('../../models/services/website/model')
    const data_website = await ModelWebsite.find({customer_id:customer_id});
    data_website.forEach(item => {
      total_price += item.price;
    });
    
    // content
    const ModelContent = require('../../models/services/content/model')
    const data_content = await ModelContent.find({customer_id:customer_id}).populate('content_plan_id').exec();
    data_content.forEach(item => {
      if (item.content_plan_id && item.content_plan_id.price) {
        total_price += item.periods * item.content_plan_id.price;
      }
    });
    
    // toplist
    const ModelToplist = require('../../models/services/toplist/model')
    const data_toplist = await ModelToplist.find({customer_id:customer_id});
    data_toplist.forEach(item => {
      total_price += item.periods * item.price;
    });
    
    // maintenance
    const ModelMaintenance = require('../../models/services/maintenance/model')
    const data_maintenance = await ModelMaintenance.find({customer_id:customer_id}).populate('maintenance_plan_id').exec();
    data_maintenance.forEach(item => {
      if (item.maintenance_plan_id && item.maintenance_plan_id.price) {
        total_price += item.periods * item.maintenance_plan_id.price;
      }
    });

    // mobile network
    const ModelMobileNetwork = require('../../models/services/mobile-network/model')
    const data_mobile_network = await ModelMobileNetwork.find({customer_id:customer_id}).populate('mobile_network_plan_id').exec();
    data_mobile_network.forEach(item => {
      if (item.mobile_network_plan_id && item.mobile_network_plan_id.price) {
        total_price += item.periods * item.mobile_network_plan_id.price;
      }
    });

    let existingContract = await Contracts.findOne({ customer_id: customer_id });
    if (existingContract) {
      deposit_amount = existingContract.deposit_amount;
      remaining_cost = total_price - deposit_amount;

      if (remaining_cost <= 0) {
        status = 2;
      }
    } else {
      remaining_cost = total_price;
    }

    const code = await Contracts.createCode();
    const data_contract = await Contracts.findOneAndUpdate(
      { customer_id: customer_id },
      {
        $setOnInsert: {
          customer_id: customer_id,
          contract_code: code,
        },
        $set: {
          total_price: total_price,
          deposit_amount: deposit_amount,
          remaining_cost: remaining_cost,
          status: status,
        },
      },
      { upsert: true, new: true }
    );
    // await logAction(auth._id, 'Hợp đồng', 'Thêm mới hoặc Cập nhật');
  } catch (error) {
    console.log(error);
  }
} 
