const dayjs = require('dayjs');

const SslITVT = require("../../../models/itvt/ssl/model");
const logAction = require("../../../middleware/actionLogs");

const sslITVTController = {
  addSslITVT: async(req, res) => {
    try {
      const {domain_itvt_id} = req.body;
      const existingDomainName = await SslITVT.findOne({domain_itvt_id});
      if (existingDomainName) {
        return res.status(400).json({message: 'Tên miền đăng ký đã tồn tại! Vui lòng chọn tên miền khác!'});
      }

      const newSslITVT = new SslITVT(req.body);
      newSslITVT.expiredAt = new Date(newSslITVT.registeredAt);
      newSslITVT.expiredAt.setFullYear(newSslITVT.expiredAt.getFullYear() + req.body.periods);
      const saveSslITVT = await newSslITVT.save();
      await logAction(req.auth._id, 'Dịch vụ SSL ITVT', 'Thêm mới');
      return res.status(200).json(saveSslITVT);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getSslITVT: async(req, res) => {
    try {
      let sslITVT = await SslITVT
        .find()
        .sort({"createdAt": -1})
        .populate('domain_itvt_id')
        .populate('ssl_plan_id');
      
      for (const item of sslITVT) {
        const domain_plan_id = item.domain_itvt_id.domain_plan_id;
        const domain_supplier_id = item.domain_itvt_id.supplier_id;
        const ssl_supplier_id = item.ssl_plan_id.supplier_id;

        try {
          sslITVT = await SslITVT.findByIdAndUpdate(
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

      sslITVT = await SslITVT.find().sort({"createdAt": -1})
        .populate('domain_itvt_id')
        .populate('ssl_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');
      
      
      return res.status(200).json(sslITVT);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailSslITVT: async(req, res) => {
    try {
      const sslITVT = await SslITVT.findById(req.params.id)
        .populate('domain_itvt_id')
        .populate('ssl_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');

      return res.status(200).json(sslITVT);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteSslITVT: async(req, res) => {
    try {
      await SslITVT.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ SSL ITVT', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateSslITVT: async(req, res) => {
    try {
      const sslITVT = await SslITVT.findById(req.params.id);
      if (req.body.periods) {
        const currentDate = new Date();
        const expiredAt = currentDate.setFullYear(currentDate.getFullYear() + req.body.periods);
        await sslITVT.updateOne({$set: {expiredAt: expiredAt, status: 1}});
      }

      if (req.body.before_payment) {
        await sslITVT.updateOne({$set: {before_payment: true}});
      }
      
      await sslITVT.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ SSL ITVT', 'Cập nhật', `/trang-chu/itvt/cap-nhat-ssl-itvt/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getSslITVTExpired: async(req, res) => {
    try {
      var currentDate = new Date();
      var sslITVTExpired = await SslITVT.find(
        {
          expiredAt: {$lte: currentDate}
        }
      );

      for (const item of sslITVTExpired) {
        try {
          sslITVTExpired = await SslITVT.findByIdAndUpdate(
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

      sslITVTExpired = await SslITVT
        .find(
          {
            expiredAt: {$lte: currentDate}
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_itvt_id')
        .populate('ssl_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');
      
      return res.status(200).json(sslITVTExpired);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getSslITVTExpiring: async(req, res) => {
    try {
      var currentDate = new Date();
      var dateExpired = dayjs(currentDate).add(30, 'day');
      var sslITVTExpiring = await SslITVT.find(
        {
          expiredAt: {
            $gte: dayjs(currentDate).startOf('day').toDate(),
            $lte: dayjs(dateExpired).endOf('day').toDate()
          }
        }
      );

      for (const item of sslITVTExpiring) {
        try {
          sslITVTExpiring = await SslITVT.findByIdAndUpdate(
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

      sslITVTExpiring = await SslITVT
        .find(
          {
            expiredAt: {
              $gte: dayjs(currentDate).startOf('day').toDate(),
              $lte: dayjs(dateExpired).endOf('day').toDate()
            }
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_itvt_id')
        .populate('ssl_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('domain_plan_id')
        .populate('domain_supplier_id', 'name company')
        .populate('ssl_supplier_id', 'name company');
      
      return res.status(200).json(sslITVTExpiring);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = sslITVTController;