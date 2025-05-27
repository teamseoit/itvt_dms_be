const IpWhitelists = require("../../models/ip-whitelist/model");

const logAction = require("../../middleware/action_logs");

const ipWhiteListController = {
  addIpWhitelist: async(req, res) => {
    try {
      const { ip } = req.body;
      const existingIp = await IpWhitelists.findOne({ ip });
      if (existingIp) {
        if (existingIp.ip === ip) {
          return res.status(400).json({message: 'IP đã tồn tại! Vui lòng nhập IP khác!'});
        }
      }

      const data = new IpWhitelists(req.body);
      const saveData = await data.save();
      await logAction(req.auth._id, 'IP Whitelist', 'Thêm mới');
      console.log(req.auth._id);
      return res.status(200).json(saveData);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getIpWhitelist: async(req, res) => {
    try {
      const data = await IpWhitelists.find().sort({"createdAt": -1});
      return res.status(200).json(data);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteIpWhitelist: async(req, res) => {
    try {
      await IpWhitelists.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'IP Whitelist', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  isValidIp: async(req, res) => {
    try {
      const clientIp = req.ip;

      const ipFound = await IpWhitelists.findOne({ ip: clientIp });

      if (ipFound) {
        return res.status(200).json({
          message: 'IP được chấp nhận',
          ip: clientIp
        });
      } else {
        return res.status(403).json({
          message: 'IP không nằm trong whitelist',
          ip: clientIp
        });
      }
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = ipWhiteListController;