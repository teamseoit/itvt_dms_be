const dayjs = require('dayjs');

const SslServices = require("../../../models/services/ssl/model");
const DomainServices = require("../../../models/services/domain/model");
const logAction = require("../../../middleware/action_logs");

const sslServicesController = {
  addSslServices: async(req, res) => {
    try {
      const {domain_service_id} = req.body;
      const existingDomainName = await SslServices.findOne({domain_service_id});
      if (existingDomainName) {
        return res.status(400).json({message: 'Tên miền đăng ký đã tồn tại! Vui lòng chọn tên miền khác!'});
      }

      const newSslServices = new SslServices(req.body);
      newSslServices.expiredAt = new Date(newSslServices.registeredAt);
      newSslServices.expiredAt.setFullYear(newSslServices.expiredAt.getFullYear() + req.body.periods);
      const saveSslServices = await newSslServices.save();
      await logAction(req.auth._id, 'Dịch vụ SSL', 'Thêm mới');
      return res.status(200).json(saveSslServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getSslServices: async(req, res) => {
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

      let sslServices = await SslServices
        .find(query)
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('ssl_plan_id');
      
      for (const item of sslServices) {
        const domain_plan_id = item.domain_service_id?.domain_plan_id;
        const domain_supplier_id = item.domain_service_id?.supplier_id;
        const ssl_supplier_id = item.ssl_plan_id?.supplier_id;

        try {
          sslServices = await SslServices.findByIdAndUpdate(
            item._id,
            {
              $set: {
                domain_plan_id: domain_plan_id,
                domain_supplier_id: domain_supplier_id,
                ssl_supplier_id: ssl_supplier_id,
              }
            },
            { new: true }
          );
        } catch (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }
      }

      sslServices = await SslServices.find(query).sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('ssl_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');
      
      return res.status(200).json(sslServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailSslServices: async(req, res) => {
    try {
      const sslServices = await SslServices.findById(req.params.id)
        .populate('domain_service_id')
        .populate('ssl_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');

      return res.status(200).json(sslServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteSslServices: async(req, res) => {
    try {
      await SslServices.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ SSL', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateSslServices: async(req, res) => {
    try {
      const sslServices = await SslServices.findById(req.params.id);
      if (req.body.periods) {
        const currentDate = new Date();
        const expiredAt = currentDate.setFullYear(currentDate.getFullYear() + req.body.periods);
        await sslServices.updateOne({$set: {expiredAt: expiredAt, status: 1}});
      }

      if (req.body.before_payment) {
        await sslServices.updateOne({$set: {before_payment: true}});
      }
      
      await sslServices.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ SSL', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-ssl/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getSslServicesExpired: async(req, res) => {
    try {
      var currentDate = new Date();
      var sslServicesExpired = await SslServices.find(
        {
          expiredAt: {$lte: currentDate}
        }
      );

      for (const item of sslServicesExpired) {
        try {
          sslServicesExpired = await SslServices.findByIdAndUpdate(
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

      sslServicesExpired = await SslServices
        .find(
          {
            expiredAt: {$lte: currentDate}
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('ssl_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');
      
      return res.status(200).json(sslServicesExpired);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getSslServicesExpiring: async(req, res) => {
    try {
      var currentDate = new Date();
      var dateExpired = dayjs(currentDate).add(30, 'day');
      var sslServicesExpiring = await SslServices.find(
        {
          expiredAt: {
            $gte: dayjs(currentDate).startOf('day').toDate(),
            $lte: dayjs(dateExpired).endOf('day').toDate()
          }
        }
      );

      for (const item of sslServicesExpiring) {
        try {
          sslServicesExpiring = await SslServices.findByIdAndUpdate(
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

      sslServicesExpiring = await SslServices
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
        .populate('ssl_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');
      
      return res.status(200).json(sslServicesExpiring);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getSslServicesBeforePayment: async(req, res) => {
    try {
      const sslServicesBeforePayment = await SslServices
        .find(
          {
            before_payment: true
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('ssl_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');
      
      return res.status(200).json(sslServicesBeforePayment);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },
  getSslServicesByCustomerId: async(req, res) => {
    try {
      const customer_id = req.params.customer_id;
      const sslServices = await SslServices
        .find(
          {
            customer_id: customer_id
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('ssl_plan_id')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');
      
      return res.status(200).json(sslServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = sslServicesController;