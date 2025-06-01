const dayjs = require('dayjs');

const MaintenanceServices = require("../../../models/services/maintenance/model");
const logAction = require("../../../middleware/actionLogs");

const maintenanceServicesController = {
  addMaintenanceServices: async(req, res) => {
    try {
      const newMaintenanceServices = new MaintenanceServices(req.body);
      newMaintenanceServices.expiredAt = new Date(newMaintenanceServices.registeredAt);
      newMaintenanceServices.expiredAt.setMonth(newMaintenanceServices.expiredAt.getMonth() + req.body.periods);
      const saveMaintenanceServices = await newMaintenanceServices.save();
      await logAction(req.auth._id, 'Dịch vụ Bảo trì', 'Thêm mới');
      return res.status(200).json(saveMaintenanceServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getMaintenanceServices: async(req, res) => {
    try {
      let maintenanceServices = await MaintenanceServices
        .find()
        .sort({"createdAt": -1})
        .populate('domain_service_id');
      
      for (const item of maintenanceServices) {
        const domain_plan_id = item.domain_service_id.domain_plan_id;
        const domain_supplier_id = item.domain_service_id.supplier_id;

        try {
          maintenanceServices = await MaintenanceServices.findByIdAndUpdate(
            item._id,
            {
              $set: {
                domain_plan_id: domain_plan_id,
                domain_supplier_id: domain_supplier_id,
              }
            },
            { new: true }
          );
        } catch (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }
      }

      maintenanceServices = await MaintenanceServices.find().sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('maintenance_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
      
      
      return res.status(200).json(maintenanceServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailMaintenanceServices: async(req, res) => {
    try {
      const maintenanceServices = await MaintenanceServices.findById(req.params.id)
        .populate('domain_service_id')
        .populate('maintenance_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company');
      
      return res.status(200).json(maintenanceServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteMaintenanceServices: async(req, res) => {
    try {
      await MaintenanceServices.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ Bảo trì', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateMaintenanceServices: async(req, res) => {
    try {
      const maintenanceServices = await MaintenanceServices.findById(req.params.id);
      if (req.body.periods) {
        const currentDate = new Date();
        const expiredAt = currentDate.setMonth(currentDate.getMonth() + req.body.periods);
        await maintenanceServices.updateOne({$set: {expiredAt: expiredAt, status: 1}});
      }
      await maintenanceServices.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ Bảo trì', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-bao-tri/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getMaintenanceServicesExpired: async(req, res) => {
    try {
      var currentDate = new Date();
      var maintenanceServicesExpired = await MaintenanceServices.find(
        {
          expiredAt: {$lte: currentDate}
        }
      );

      for (const item of maintenanceServicesExpired) {
        try {
          maintenanceServicesExpired = await MaintenanceServices.findByIdAndUpdate(
            item._id,
            {
              $set: {
                status: 3
              }
            },
            { new: true }
          );
        } catch (error) {
          res.status(500).json(error);
        }
      }

      maintenanceServicesExpired = await MaintenanceServices
        .find(
          {
            expiredAt: {$lte: currentDate}
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('maintenance_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company');
      
      return res.status(200).json(maintenanceServicesExpired);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getMaintenanceServicesExpiring: async(req, res) => {
    try {
      var currentDate = new Date();
      var dateExpired = dayjs(currentDate).add(30, 'day');
      var maintenanceServicesExpiring = await MaintenanceServices.find(
        {
          expiredAt: {
            $gte: dayjs(currentDate).startOf('day').toDate(),
            $lte: dayjs(dateExpired).endOf('day').toDate()
          }
        }
      );

      for (const item of maintenanceServicesExpiring) {
        try {
          maintenanceServicesExpiring = await MaintenanceServices.findByIdAndUpdate(
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

      maintenanceServicesExpiring = await MaintenanceServices
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
        .populate('maintenance_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company');
      
      return res.status(200).json(maintenanceServicesExpiring);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getMaintenanceServicesByCustomerId: async(req, res) => {
    try {
      const customer_id = req.params.customer_id;
      const maintenance_services = await MaintenanceServices
        .find(
          {
            customer_id: customer_id
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('maintenance_plan_id')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company');
      
      return res.status(200).json(maintenance_services);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = maintenanceServicesController;