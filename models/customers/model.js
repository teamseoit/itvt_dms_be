const mongoose = require("mongoose");
// const mongooseLeanVirtuals = require('mongoose-lean-virtuals')

const customerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    index: true,
  },
  gender: {
    type: Number,
    required: true,
  },
  idNumber: {
    type: Number,
    required: true
  },
  phone: {
    type: Number,
    required: true,
    index: true,
  },
  address: {
    type: String,
  },
  company: {
    type: String,
  },
  tax_code: {
    type: String,
  },
  address_company: {
    type: String,
  },
  representative: {
    type: String,
  },
  representative_hotline: {
    type: String,
  },
  mail_vat: {
    type: String,
  },
  image_front_view: {
    type: [String],
  },
  image_back_view: {
    type: [String],
  },
  type_customer: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

// customerSchema.plugin(mongooseLeanVirtuals.mongooseLeanVirtuals)
// 	customerSchema.pre(['find', 'findOne', 'findById'], async function (next) {
// 		// this.lean({ virtuals: true })
// 		this.sort({ _id: -1 })
// 		return next()
// 	})

const Customer = mongoose.model("Customers", customerSchema);
module.exports = Customer;

customerSchema.virtual('data_service', {
	ref: 'DomainServices',
	localField: '_id',
	foreignField: 'customer_id',
	justOne: false,
});
	
	// Schema.pre(['aggregate'], async function (next) {
	// 	let is_sort = false
	// 	for (let i = 0; i < this._pipeline.length; i++) {
	// 		Object.keys(this._pipeline[i]).map((key) => {
	// 			if (key == '$sort') {
	// 				is_sort = true
	// 			}
	// 		})
	// 	}
	// 	if (!is_sort) {
	// 		this.sort({ _id: -1 })
	// 	}

	// 	return next()
	// })

	// Schema.pre(['findOneAndUpdate', 'findByIdAndUpdate'], async function (next) {
	// 	this.options.runValidators = true
	// 	// this.options.new = true
	// 	this.lean({ virtuals: true })
	// 	return next()
	// })

	// Schema.pre(['updateOne', 'updateMany'], async function (next) {
	// 	this.options.runValidators = true
	// 	// this.options.new = true
	// 	return next()
	// })
	// Schema.post(['find'], async function(docs, next) {
	//     return next(docs)
	// })
