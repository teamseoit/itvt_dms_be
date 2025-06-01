const Server = require("../../../models/suppliers/server/model");
const ServerPlans = require("../../../models/plans/server/model");
const logAction = require("../../../middleware/actionLogs");

const serverController = {
  getServer: async(req, res) => {
    try {
      const server = await Server.find().sort({"createdAt": -1});
      return res.status(200).json(server);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  addServer: async(req, res) => {
    try {
      const { name, company, tax_code, address } = req.body;
      const existingServer = await Server.findOne({ $or: [{ name }, {company}, { tax_code }] });
      if (existingServer) {
        let errorMessage = '';
        if (existingServer.name === name) {
          errorMessage = 'Tên nhà cung cấp đã tồn tại! Vui lòng nhập tên khác!';
        } else if (existingServer.company === company) {
          errorMessage = 'Tên công ty đã tồn tại! Vui lòng nhập tên công ty khác!';
        } else if (existingServer.tax_code === tax_code) {
          errorMessage = 'MST đã tồn tại! Vui lòng nhập MST khác!';
        }
        return res.status(400).json({ message: errorMessage });
      }

      const specialCharRegex = /[!@#$%^&*()_+={}[\]:;"'<>,.?/|\\]/;
      if (specialCharRegex.test(name)) {
        return res.status(400).json({ message: "Tên nhà cung cấp không được chứa ký tự đặc biệt!" });
      }

      if (specialCharRegex.test(company)) {
        return res.status(400).json({ message: "Tên công ty không được chứa ký tự đặc biệt!" });
      }

      if (specialCharRegex.test(address)) {
        return res.status(400).json({ message: "Địa chỉ không được chứa ký tự đặc biệt!" });
      }

      const newServer = new Server(req.body);
      const saveServer = await newServer.save();
      await logAction(req.auth._id, 'Server', 'Thêm mới');
      return res.status(200).json(saveServer);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailServer: async(req, res) => {
    try {
      const server = await Server.findById(req.params.id);
      return res.status(200).json(server);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateServer: async(req, res) => {
    try {
      const server = await Server.findById(req.params.id);
      if (!server) {
        return res.status(404).json({ message: "Nhà cung cấp Server không tồn tại!" });
      }

      const { name, company, address } = req.body;
      if (name && name !== server.name) {
        const existingServerName = await Server.findOne({ name });
        if (existingServerName) {
          return res.status(400).json({ message: "Tên nhà cung cấp đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      if (company && company !== server.company) {
        const existingServerCompany = await Server.findOne({ company });
        if (existingServerCompany) {
          return res.status(400).json({ message: "Tên công ty đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      const specialCharRegex = /[!@#$%^&*()_+={}[\]:;"'<>,.?/|\\]/;
      if (specialCharRegex.test(name)) {
        return res.status(400).json({ message: "Tên nhà cung cấp không được chứa ký tự đặc biệt!" });
      }

      if (specialCharRegex.test(company)) {
        return res.status(400).json({ message: "Tên công ty không được chứa ký tự đặc biệt!" });
      }

      if (specialCharRegex.test(address)) {
        return res.status(400).json({ message: "Địa chỉ không được chứa ký tự đặc biệt!" });
      }

      await server.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Server', 'Cập nhật', `/trang-chu/nha-cung-cap/server/cap-nhat-server/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteServer: async(req, res) => {
    try {
      const supplierId = req.params.id;
      const serverPlanExists = await ServerPlans.findOne({ supplier_id: supplierId });

      if (serverPlanExists) {
        return res.status(400).json({ message: "Không thể xóa nhà cung cấp khi đang được sử dụng!" });
      }

      await Server.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Server', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },
}

module.exports = serverController;