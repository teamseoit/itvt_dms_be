const dayjs = require('dayjs');

const HostingServices = require("../../../models/services/hosting/model");
const logAction = require("../../../middleware/actionLogs");

const hostingServicesController = {
  addHostingServices: async(req, res) => {
    try {
      const {domain_service_id} = req.body;
      const existingDomainName = await HostingServices.findOne({domain_service_id});
      if (existingDomainName) {
        return res.status(400).json({message: 'Tên miền đăng ký đã tồn tại! Vui lòng chọn tên miền khác!'});
      }

      const newHostingServices = new HostingServices(req.body);
      newHostingServices.expiredAt = new Date(newHostingServices.registeredAt);
      newHostingServices.expiredAt.setFullYear(newHostingServices.expiredAt.getFullYear() + req.body.periods);
      await logAction(req.auth._id, 'Dịch vụ Hosting', 'Thêm mới');
      const saveHostingServices = await newHostingServices.save();
      return res.status(200).json(saveHostingServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getHostingServices: async(req, res) => {
    try {
      let hostingServices = await HostingServices
        .find()
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('hosting_plan_id');
      
      for (const item of hostingServices) {
        const domain_plan_id = item.domain_service_id.domain_plan_id;
        const domain_supplier_id = item.domain_service_id.supplier_id;
        const hosting_supplier_id = item.hosting_plan_id.supplier_id;

        try {
          hostingServices = await HostingServices.findByIdAndUpdate(
            item._id,
            {
              $set: {
                domain_plan_id: domain_plan_id,
                domain_supplier_id: domain_supplier_id,
                hosting_supplier_id: hosting_supplier_id,
              }
            },
            { new: true }
          );
        } catch (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }
      }

      hostingServices = await HostingServices.find().sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('hosting_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('hosting_supplier_id', 'name company');
      
      return res.status(200).json(hostingServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailHostingServices: async(req, res) => {
    try {
      const hostingServices = await HostingServices.findById(req.params.id)
        .populate('domain_service_id')
        .populate('hosting_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('hosting_supplier_id', 'name company');
      
      return res.status(200).json(hostingServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteHostingServices: async(req, res) => {
    try {
      await HostingServices.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ Hosting', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateHostingServices: async(req, res) => {
    try {
      const hostingServices = await HostingServices.findById(req.params.id);
      if (req.body.periods) {
        const currentDate = new Date();
        const expiredAt = currentDate.setFullYear(currentDate.getFullYear() + req.body.periods);
        await hostingServices.updateOne({$set: {expiredAt: expiredAt, status: 1}});
      }

      if (req.body.before_payment) {
        await hostingServices.updateOne({$set: {before_payment: true}});
      }
      
      await hostingServices.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ Hosting', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-hosting/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getHostingServicesExpired: async(req, res) => {
    try {
      var currentDate = new Date();
      var hostingServicesExpired = await HostingServices.find(
        {
          expiredAt: {$lte: currentDate}
        }
      );

      for (const item of hostingServicesExpired) {
        try {
          hostingServicesExpired = await HostingServices.findByIdAndUpdate(
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

      hostingServicesExpired = await HostingServices
        .find(
          {
            expiredAt: {$lte: currentDate}
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('hosting_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('hosting_supplier_id', 'name company');
      
      return res.status(200).json(hostingServicesExpired);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getHostingServicesExpiring: async(req, res) => {
    try {
      var currentDate = new Date();
      var dateExpired = dayjs(currentDate).add(30, 'day');
      var hostingServicesExpiring = await HostingServices.find(
        {
          expiredAt: {
            $gte: dayjs(currentDate).startOf('day').toDate(),
            $lte: dayjs(dateExpired).endOf('day').toDate()
          }
        }
      );

      for (const item of hostingServicesExpiring) {
        try {
          hostingServicesExpiring = await HostingServices.findByIdAndUpdate(
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

      hostingServicesExpiring = await HostingServices
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
        .populate('hosting_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('hosting_supplier_id', 'name company');
      
      return res.status(200).json(hostingServicesExpiring);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getHostingServicesBeforePayment: async(req, res) => {
    try {
      const hostingServicesBeforePayment = await HostingServices
        .find(
          {
            before_payment: true
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('hosting_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('hosting_supplier_id', 'name company');
      
      return res.status(200).json(hostingServicesBeforePayment);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },
  
  getHostingServicesByCustomerId: async(req, res) => {
    try {
      const customer_id = req.params.customer_id;
      const hosting_services = await HostingServices
      .find(
        {
          customer_id: customer_id
        }
      )
      .sort({"createdAt": -1})
      .populate('domain_service_id')
      .populate('hosting_plan_id')
      .populate('domain_plan_id')
      .populate('domain_supplier_id', 'name company')
      .populate('hosting_supplier_id', 'name company');
    
    return res.status(200).json(hosting_services);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = hostingServicesController;