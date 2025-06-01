const dayjs = require('dayjs');

const EmailServices = require("../../../models/services/email/model");
const DomainServices = require("../../../models/services/domain/model");
const logAction = require("../../../middleware/actionLogs");

const emailServicesController = {
  addEmailServices: async(req, res) => {
    try {
      const {domain_service_id} = req.body;
      const existingDomainName = await EmailServices.findOne({domain_service_id});
      if (existingDomainName) {
        return res.status(400).json({message: 'Tên miền đăng ký đã tồn tại! Vui lòng chọn tên miền khác!'});
      }

      const newEmailServices = new EmailServices(req.body);
      newEmailServices.expiredAt = new Date(newEmailServices.registeredAt);
      newEmailServices.expiredAt.setFullYear(newEmailServices.expiredAt.getFullYear() + req.body.periods);
      const saveEmailServices = await newEmailServices.save();
      await logAction(req.auth._id, 'Dịch vụ Email', 'Thêm mới');
      return res.status(200).json(saveEmailServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getEmailServices: async(req, res) => {
    try {
      const { domainServiceName } = req.query;

      let query = {};

      if (domainServiceName) {
        const matchingDomainServices = await DomainServices.find({
          name: { $regex: domainServiceName, $options: 'i' }
        }).select('_id');

        const matchingIds = matchingDomainServices.map(ds => ds._id);
        query.domain_service_id = { $in: matchingIds };
      }
  
      let emailServices = await EmailServices
        .find(query)
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('email_plan_id');
      
      for (const item of emailServices) {
        const domain_plan_id = item.domain_service_id?.domain_plan_id;
        const domain_supplier_id = item.domain_service_id?.supplier_id;
        const email_supplier_id = item.email_plan_id?.supplier_id;

        try {
          emailServices = await EmailServices.findByIdAndUpdate(
            item._id,
            {
              $set: {
                domain_plan_id: domain_plan_id,
                domain_supplier_id: domain_supplier_id,
                email_supplier_id: email_supplier_id,
              }
            },
            { new: true }
          );
        } catch (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }
      }

      emailServices = await EmailServices.find(query).sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('email_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('email_supplier_id', 'name company');

      return res.status(200).json(emailServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailEmailServices: async(req, res) => {
    try {
      const emailServices = await EmailServices.findById(req.params.id)
        .populate('domain_service_id')
        .populate('email_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('email_supplier_id', 'name company');
      
      return res.status(200).json(emailServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteEmailServices: async(req, res) => {
    try {
      await EmailServices.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ Email', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateEmailServices: async(req, res) => {
    try {
      const emailServices = await EmailServices.findById(req.params.id);
      if (req.body.periods) {
        const currentDate = new Date();
        const expiredAt = currentDate.setFullYear(currentDate.getFullYear() + req.body.periods);
        await emailServices.updateOne({$set: {expiredAt: expiredAt, status: 1}});
      }

      if (req.body.before_payment) {
        await emailServices.updateOne({$set: {before_payment: true}});
      }
      
      await emailServices.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ Email', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-email/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getEmailServicesExpired: async(req, res) => {
    try {
      var currentDate = new Date();
      var emailServicesExpired = await EmailServices.find(
        {
          expiredAt: {$lte: currentDate}
        }
      );

      for (const item of emailServicesExpired) {
        try {
          emailServicesExpired = await EmailServices.findByIdAndUpdate(
            item._id,
            {
              $set: {
                status: 3
              }
            },
            { new: true }
          );
        } catch (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }
      }

      emailServicesExpired = await EmailServices
        .find(
          {
            expiredAt: {$lte: currentDate}
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('email_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('email_supplier_id', 'name company');
      
      return res.status(200).json(emailServicesExpired);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getEmailServicesExpiring: async(req, res) => {
    try {
      var currentDate = new Date();
      var dateExpired = dayjs(currentDate).add(30, 'day');
      var emailServicesExpiring = await EmailServices.find(
        {
          expiredAt: {
            $gte: dayjs(currentDate).startOf('day').toDate(),
            $lte: dayjs(dateExpired).endOf('day').toDate()
          }
        }
      );

      for (const item of emailServicesExpiring) {
        try {
          emailServicesExpiring = await EmailServices.findByIdAndUpdate(
            item._id,
            {
              $set: {
                status: 2
              }
            },
            { new: true }
          );
        } catch (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }
      }

      emailServicesExpiring = await EmailServices
        .find(
          {
            expiredAt: {
              $gte: dayjs(currentDate).startOf('day').toDate(),
              $lte: dayjs(dateExpired).endOf('day').toDate()
            }
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('email_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('email_supplier_id', 'name company');
      
      return res.status(200).json(emailServicesExpiring);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getEmailServicesBeforePayment: async(req, res) => {
    try {
      const emailServicesBeforePayment = await EmailServices
        .find(
          {
            before_payment: true
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('email_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('email_supplier_id', 'name company');
      
      return res.status(200).json(emailServicesBeforePayment);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getEmailServicesByCustomerId: async(req, res) => {
    try {
      const customer_id = req.params.customer_id;
      const email_services = await EmailServices
        .find(
          {
            customer_id: customer_id
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('email_plan_id')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('email_supplier_id', 'name company');
      
      return res.status(200).json(email_services);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = emailServicesController;