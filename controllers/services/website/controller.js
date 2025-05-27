const WebsiteServices = require("../../../models/services/website/model");
const logAction = require("../../../middleware/action_logs");

const websiteServicesController = {
  addWebsiteServices: async(req, res) => {
    try {
      const {domain_service_id} = req.body;
      const existingDomainName = await WebsiteServices.findOne({domain_service_id});
      if (existingDomainName) {
        return res.status(400).json({message: 'Tên miền đăng ký đã tồn tại! Vui lòng chọn tên miền khác!'});
      }

      const newWebsite = new WebsiteServices(req.body);
      const saveWebsiteServices = await newWebsite.save();
      await logAction(req.auth._id, 'Dịch vụ Website', 'Thêm mới');
      return res.status(200).json(saveWebsiteServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getWebsiteServices: async(req, res) => {
    try {
      let websiteServices = await WebsiteServices
        .find()
        .sort({"createdAt": -1})
        .populate('domain_service_id');
      
      for (const item of websiteServices) {
        const domain_plan_id = item.domain_service_id.domain_plan_id;
        const domain_supplier_id = item.domain_service_id.supplier_id;

        try {
          websiteServices = await WebsiteServices.findByIdAndUpdate(
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

      websiteServices = await WebsiteServices.find().sort({"createdAt": -1})
        .populate('domain_service_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id', 'name')
        .populate('domain_supplier_id', 'name company')
      
      return res.status(200).json(websiteServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailWebsiteServices: async(req, res) => {
    try {
      const websiteServices = await WebsiteServices.findById(req.params.id)
        .populate('domain_service_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id', 'name')
        .populate('domain_supplier_id', 'name company');

      return res.status(200).json(websiteServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteWebsiteServices: async(req, res) => {
    try {
      await WebsiteServices.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ Website', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateWebsiteServices: async(req, res) => {
    try {
      const websiteServices = await WebsiteServices.findById(req.params.id);
      await websiteServices.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ Website', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-website/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getWebsiteServicesClosed: async(req, res) => {
    try {
      var websiteServicesClosed = await WebsiteServices.find(
        {
          status: 2
        }
      )
      .sort({"createdAt": -1})
      .populate('domain_service_id')
      .populate('customer_id', 'fullname gender email phone')
      .populate('domain_plan_id', 'name')
      .populate('domain_supplier_id', 'name company');
    
      return res.status(200).json(websiteServicesClosed);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getWebsiteServicesByCustomerId: async(req, res) => {
    try {
      const customer_id = req.params.customer_id;
      const websiteServices = await WebsiteServices.find(
        {
          customer_id: customer_id
        }
      )
      .sort({"createdAt": -1})
      .populate('domain_service_id')
      .populate('domain_plan_id', 'name')
      .populate('domain_supplier_id', 'name company');
    
      return res.status(200).json(websiteServices);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = websiteServicesController;