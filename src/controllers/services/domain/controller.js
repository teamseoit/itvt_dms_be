const dayjs = require('dayjs');

const DomainServices = require("../../../models/services/domain/model");
const CronDomainServices = require("../../../models/services/domain/model_cron");
const logAction = require("../../../middleware/actionLogs");

const domainServicesController = {
  addDomainServices: async(req, res) => {
    try {
      // dịch vụ
      const {name} = req.body;
      const existingName = await DomainServices.findOne({name});
      if (existingName) {
        if (existingName.name === name) {
          return res.status(400).json({message: 'Tên miền đăng ký đã tồn tại! Vui lòng nhập tên miền khác!'});
        }
      }

      const newDomainServices = new DomainServices(req.body);
      newDomainServices.expiredAt = new Date(newDomainServices.registeredAt);
      newDomainServices.expiredAt.setFullYear(newDomainServices.expiredAt.getFullYear() + req.body.periods);
      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Thêm mới');
      const saveDomainServices = await newDomainServices.save();

      // cron dịch vụ
      const newCronDomainServices = new CronDomainServices(req.body);
      newCronDomainServices.expiredAt = new Date(newDomainServices.registeredAt);
      newCronDomainServices.expiredAt.setFullYear(newCronDomainServices.expiredAt.getFullYear() + req.body.periods);
      await newCronDomainServices.save();

      return res.status(200).json(saveDomainServices);
    } catch(err) {
      console.error(err)
      return res.status(500).send(err.message);
    }
  },

  getDomainServices: async(req, res) => {
    try {
      const { keyword } = req.query;

      let filter = {};
      if (keyword) {
        filter = {name: { $regex: keyword, $options: 'i' }};
      }

      let domainServices = await DomainServices.find().sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('server_plan_id', 'name')
        .populate('customer_id', 'fullname gender email phone');        

      for (const item of domainServices) {
        const supplier_id = item.domain_plan_id.supplier_id;
        try {
          domainServices = await DomainServices.findByIdAndUpdate(
            item._id,
            {
              $set: {
                supplier_id: supplier_id
              }
            },
            { new: true }
          );
        } catch (err) {
          console.error(err);
          return res.status(500).send(err.message);
        }
      }

      domainServices = await DomainServices.find(filter).sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('server_plan_id', 'name')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_id', 'name company');

      return res.status(200).json(domainServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailDomainServices: async(req, res) => {
    try {
      const domainServices = await DomainServices.findById(req.params.id)
        .populate('domain_plan_id')
        .populate('server_plan_id', 'name')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_id', 'name company');

      return res.status(200).json(domainServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteDomainServices: async(req, res) => {
    try {
      await DomainServices.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateDomainServices: async(req, res) => {
    try {
      const domainServices = await DomainServices.findById(req.params.id);
      if (req.body.periods) {
        const currentDate = new Date();
        const expiredAt = currentDate.setFullYear(currentDate.getFullYear() + req.body.periods);
        await domainServices.updateOne({$set: {expiredAt: expiredAt, status: 1}});
      }
      if (req.body.before_payment) {
        await domainServices.updateOne({$set: {before_payment: true}});
      }
      await domainServices.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-ten-mien/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDomainServicesExpired: async(req, res) => {
    try {
      var currentDate = new Date();
      // tìm những domain service hết hạn
      var domainServicesExpired = await DomainServices.find(
        {
          expiredAt: {$lte: currentDate}
        }
      );

      for (const item of domainServicesExpired) {
        try {
          // cập nhập bằng 3
          domainServicesExpired = await DomainServices.findByIdAndUpdate(
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

      domainServicesExpired = await DomainServices
        .find(
          {
            expiredAt: {$lte: currentDate}
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_id', 'name company');

      res.status(200).json(domainServicesExpired);
    } catch(err) {
      res.status(500).json(err);
    }

    // try {
    //     var currentDate = new Date();

    //     const [
    //       data,
    //       data_update
    //     ] = await Promise.all([
    //       DomainServices.find({expiredAt: {$lte: currentDate}}).sort({"createdAt": -1})
    //         .populate('domain_plan_id')
    //         .populate('server_plan_id', 'name')
    //         .populate('customer_id', 'fullname gender email phone')
    //         .populate('supplier_id', 'name company'),

    //       DomainServices.updateMany({expiredAt: {$lte: currentDate}},{
    //         $set: {
    //           status: 3
    //         }      
    //       })
    //     ])

    //     data.forEach(item =>{
    //       item.status = 3
    //     })
    //     return res.status(200).json(data);
    // } catch (err) {
    //   console.error(err);
    //   return res.status(500).send(err.message);
    // }
  },

  getDomainServicesExpiring: async(req, res) => {
    try {
      var currentDate = new Date();
      var dateExpired = dayjs(currentDate).add(30, 'day');
      var domainServicesExpiring = await DomainServices.find(
        {
          expiredAt: {
            $gte: dayjs(currentDate).startOf('day').toDate(),
            $lte: dayjs(dateExpired).endOf('day').toDate()
          }
        }
      );

      for (const item of domainServicesExpiring) {
        try {
          domainServicesExpiring = await DomainServices.findByIdAndUpdate(
            item._id,
            {
              $set: {
                status: 2
              }
            },
            { new: true }
          );
        } catch (error) {
          res.status(500).json(error);
        }
      }

      domainServicesExpiring = await DomainServices
        .find(
          {
            expiredAt: {
              $gte: dayjs(currentDate).startOf('day').toDate(),
              $lte: dayjs(dateExpired).endOf('day').toDate()
            }
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('server_plan_id', 'name')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_id', 'name company');

      return res.status(200).json(domainServicesExpiring);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDomainServicesBeforePayment: async(req, res) => {
    try {
      const domainServicesBeforePayment = await DomainServices
        .find(
          {
            before_payment: true
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('server_plan_id', 'name')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_id', 'name company');

      return res.status(200).json(domainServicesBeforePayment);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDomainServicesByCustomerId: async(req, res) => {
    try {
      const customer_id = req.params.customer_id;
      const domain_services = await DomainServices
        .find({
          customer_id: customer_id
        })
        .sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('server_plan_id', 'name')
        .populate('supplier_id', 'name company');
      return res.status(200).json(domain_services);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = domainServicesController;