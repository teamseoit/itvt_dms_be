const dayjs = require('dayjs');

const DomainITVT = require("../../../models/itvt/domain/model");
const logAction = require("../../../middleware/actionLogs");

const domainITVTController = {
  addDomainITVT: async(req, res) => {
    try {
      const {name} = req.body;
      const existingName = await DomainITVT.findOne({name});
      if (existingName) {
        if (existingName.name === name) {
          return res.status(400).json({message: 'Tên miền đăng ký đã tồn tại! Vui lòng nhập tên miền khác!'});
        }
      }

      const newDomainITVT = new DomainITVT(req.body);
      newDomainITVT.expiredAt = new Date(newDomainITVT.registeredAt);
      newDomainITVT.expiredAt.setFullYear(newDomainITVT.expiredAt.getFullYear() + req.body.periods);
      await logAction(req.auth._id, 'Tên miền ITVT', 'Thêm mới');
      const saveDomainITVT = await newDomainITVT.save();
      return res.status(200).json(saveDomainITVT);
    } catch(err) {
      console.error(err)
      return res.status(500).send(err.message);
    }
  },

  getDomainITVT: async(req, res) => {
    try {
      let domainITVT = await DomainITVT.find().sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('server_plan_id', 'name')
        .populate('customer_id', 'fullname gender email phone');        

      for (const item of domainITVT) {
        const supplier_id = item.domain_plan_id.supplier_id;
        try {
          domainITVT = await DomainITVT.findByIdAndUpdate(
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

      domainITVT = await DomainITVT.find().sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('server_plan_id', 'name')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_id', 'name company');

      return res.status(200).json(domainITVT);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailDomainITVT: async(req, res) => {
    try {
      const domainITVT = await DomainITVT.findById(req.params.id)
        .populate('domain_plan_id')
        .populate('server_plan_id', 'name')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_id', 'name company');

      return res.status(200).json(domainITVT);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteDomainITVT: async(req, res) => {
    try {
      await DomainITVT.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateDomainITVT: async(req, res) => {
    try {
      const domainITVT = await DomainITVT.findById(req.params.id);
      if (req.body.periods) {
        const currentDate = new Date();
        const expiredAt = currentDate.setFullYear(currentDate.getFullYear() + req.body.periods);
        await DomainITVT.updateOne({$set: {expiredAt: expiredAt, status: 1}});
      }

      await domainITVT.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ Tên miền', 'Cập nhật', `/trang-chu/itvt/cap-nhat-ten-mien-itvt/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDomainITVTExpired: async(req, res) => {
    try {
      var currentDate = new Date();
      // tìm những domain service hết hạn
      var domainITVTExpired = await DomainITVT.find(
        {
          expiredAt: {$lte: currentDate}
        }
      );

      for (const item of domainITVTExpired) {
        try {
          // cập nhập bằng 3
          domainITVTExpired = await DomainITVT.findByIdAndUpdate(
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

      domainITVTExpired = await DomainITVT
        .find(
          {
            expiredAt: {$lte: currentDate}
          }
        )
        .sort({"createdAt": -1})
        .populate('domain_plan_id')
        .populate('customer_id', 'fullname gender email phone')
        .populate('supplier_id', 'name company');

      res.status(200).json(domainITVTExpired);
    } catch(err) {
      res.status(500).json(err);
    }
  },

  getDomainITVTExpiring: async(req, res) => {
    try {
      var currentDate = new Date();
      var dateExpired = dayjs(currentDate).add(30, 'day');
      var domainITVTExpiring = await DomainITVT.find(
        {
          expiredAt: {
            $gte: dayjs(currentDate).startOf('day').toDate(),
            $lte: dayjs(dateExpired).endOf('day').toDate()
          }
        }
      );

      for (const item of domainITVTExpiring) {
        try {
          domainITVTExpiring = await DomainITVT.findByIdAndUpdate(
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

      domainITVTExpiring = await DomainITVT
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

      return res.status(200).json(domainITVTExpiring);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = domainITVTController;