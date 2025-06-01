const dayjs = require('dayjs');

const MobileNetworkServices = require("../../../models/services/mobile-network/model");
const logAction = require("../../../middleware/actionLogs");

const mobileNetworkServicesController = {
  getMobileNetworkServices: async (req, res) => {
    try {  
      let mobileNetworkServices = await MobileNetworkServices.find()
        .sort({ "createdAt": -1 })
        .populate('mobile_network_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_mobile_network_id')
        .setOptions({ strictPopulate: false });
  
      // if (!mobileNetworkServices.length) {
      //   return res.status(404).json({ message: "Không tìm thấy dịch vụ mạng di động!" });
      // }
  
      if (mobileNetworkServices) {
        for (const item of mobileNetworkServices) {
          const supplierMobileNetworkId = item.mobile_network_plan_id.supplier_mobile_network_id;
          try {
            await MobileNetworkServices.findByIdAndUpdate(
              item._id,
              {
                $set: {
                  supplier_mobile_network_id: supplierMobileNetworkId
                }
              },
              { new: true }
            );
          } catch (err) {
            console.error(err);
            return res.status(500).send(err.message);
          }
        }
    
        let newMobileNetworkServices = await MobileNetworkServices.find()
          .sort({ "createdAt": -1 })
          .populate('mobile_network_plan_id')
          .populate('customer_id', 'fullname gender email phone')
          .populate('supplier_mobile_network_id', 'name')
          .setOptions({ strictPopulate: false });
    
        return res.status(200).json(newMobileNetworkServices);
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  addMobileNetworkServices: async(req, res) => {
    try {
      const {mobile_network_plan_id} = req.body;
      const existingName = await MobileNetworkServices.findOne({mobile_network_plan_id});
      if (existingName) {
        return res.status(400).json({message: 'Gói dịch vụ đã tồn tại! Vui lòng chọn gói khác!'});
      }

      const newMobileNetworkServices = new MobileNetworkServices(req.body);
      newMobileNetworkServices.expiredAt = new Date(newMobileNetworkServices.registeredAt);
      newMobileNetworkServices.expiredAt.setFullYear(newMobileNetworkServices.expiredAt.getFullYear() + req.body.periods);
      const saveMobileNetworkServices = await newMobileNetworkServices.save();
      await logAction(req.auth._id, 'Dịch vụ nhà mạng', 'Thêm mới');
      return res.status(200).json(saveMobileNetworkServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailMobileNetworkServices: async(req, res) => {
    try {  
      const mobileNetworkServices = await MobileNetworkServices.findById(req.params.id)
        .populate('mobile_network_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_mobile_network_id')
        .setOptions({ strictPopulate: false });
  
      if (!mobileNetworkServices) {
        return res.status(404).json({ message: "Không tìm thấy dịch vụ mạng di động!" });
      }
  
      return res.status(200).json(mobileNetworkServices);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateMobileNetworkServices: async(req, res) => {
    try {
      const mobileNetworkServices = await MobileNetworkServices.findById(req.params.id);
      if (req.body.periods) {
        const currentDate = new Date();
        const expiredAt = currentDate.setFullYear(currentDate.getFullYear() + req.body.periods);
        await mobileNetworkServices.updateOne({$set: {expiredAt: expiredAt, status: 1}});
      }
      await mobileNetworkServices.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ nhà mạng', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-nha-mang/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteMobileNetworkServices: async(req, res) => {
    try {
      await MobileNetworkServices.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ nhà mạng', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getMobileNetworkServicesExpired: async(req, res) => {
    try {
      var currentDate = new Date();
      var mobileNetworkServicesExpired = await MobileNetworkServices.find(
        {
          expiredAt: {$lte: currentDate}
        }
      );

      for (const item of mobileNetworkServicesExpired) {
        try {
          mobileNetworkServicesExpired = await MobileNetworkServices.findByIdAndUpdate(
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

      mobileNetworkServicesExpired = await MobileNetworkServices
        .find(
          {
            expiredAt: {$lte: currentDate}
          }
        )
        .sort({"createdAt": -1})
        .populate('mobile_network_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_mobile_network_id');

      return res.status(200).json(mobileNetworkServicesExpired);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getMobileNetworkServicesExpiring: async(req, res) => {
    try {
      var currentDate = new Date();
      var dateExpired = dayjs(currentDate).add(30, 'day');
      var mobileNetworkServicesExpiring = await MobileNetworkServices.find(
        {
          expiredAt: {
            $gte: dayjs(currentDate).startOf('day').toDate(),
            $lte: dayjs(dateExpired).endOf('day').toDate()
          }
        }
      );

      for (const item of mobileNetworkServicesExpiring) {
        try {
          mobileNetworkServicesExpiring = await MobileNetworkServices.findByIdAndUpdate(
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

      mobileNetworkServicesExpiring = await MobileNetworkServices
        .find(
          {
            expiredAt: {
              $gte: dayjs(currentDate).startOf('day').toDate(),
              $lte: dayjs(dateExpired).endOf('day').toDate()
            }
          }
        )
        .sort({"createdAt": -1})
        .populate('mobile_network_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_mobile_network_id');
      
      return res.status(200).json(mobileNetworkServicesExpiring);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getMobileNetworkServicesByCustomerId: async(req, res) => {
    try {
      const customer_id = req.params.customer_id;
      const mobileNetworkServices = await MobileNetworkServices
        .find(
          {
            customer_id: customer_id
          }
        )
        .sort({"createdAt": -1})
        .populate('mobile_network_plan_id')
        .populate('supplier_mobile_network_id');
      
      return res.status(200).json(mobileNetworkServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = mobileNetworkServicesController;