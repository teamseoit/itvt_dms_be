const dayjs = require('dayjs');

const ToplistServices = require("../../../models/services/toplist/model");
const logAction = require("../../../middleware/action_logs");

const toplistServiceController = {
  addToplistService: async(req, res) => {
    try {
      const {post} = req.body;
      const existingPost = await ToplistServices.findOne({post});
      if (existingPost) {
        if (existingPost.post === post) {
          return res.status(400).json({message: 'Tiêu đề bài viết đã tồn tại! Vui lòng nhập tiêu đề khác!'});
        }
      }
  
      const newToplistService = new ToplistServices(req.body);
      newToplistService.expiredAt = new Date(newToplistService.registeredAt);
      newToplistService.expiredAt.setFullYear(newToplistService.expiredAt.getFullYear() + req.body.periods);
      const saveToplistService = await newToplistService.save();
      await logAction(req.auth._id, 'Dịch vụ Toplist', 'Thêm mới');
      return res.status(200).json(saveToplistService);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getToplistService: async(req, res) => {
    try {
      let toplistService = await ToplistServices.find().sort({"createdAt": -1}).populate('customer_id', 'fullname gender email phone');
      return res.status(200).json(toplistService);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailToplistService: async(req, res) => {
    try {
      const toplistService = await ToplistServices.findById(req.params.id)
        .populate('customer_id', 'fullname gender email phone');
      
      return res.status(200).json(toplistService);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteToplistService: async(req, res) => {
    try {
      await ToplistServices.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Dịch vụ Toplist', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateToplistService: async(req, res) => {
    try {
      const toplistService = await ToplistServices.findById(req.params.id);
      if (req.body.periods) {
        const currentDate = new Date();
        const expiredAt = currentDate.setFullYear(currentDate.getFullYear() + req.body.periods);
        await toplistService.updateOne({$set: {expiredAt: expiredAt, status: 1}});
      }
      await toplistService.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Dịch vụ Toplist', 'Cập nhật', `/trang-chu/dich-vu/cap-nhat-toplist/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getToplistServiceExpired: async(req, res) => {
    try {
      var currentDate = new Date();
      var toplistServiceExpired = await ToplistServices.find(
        {
          expiredAt: {$lte: currentDate}
        }
      );

      for (const item of toplistServiceExpired) {
        try {
          toplistServiceExpired = await ToplistServices.findByIdAndUpdate(
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

      toplistServiceExpired = await ToplistServices
        .find(
          {
            expiredAt: {$lte: currentDate}
          }
        )
        .sort({"createdAt": -1})
        .populate('customer_id', 'fullname gender email phone');
      
      
      return res.status(200).json(toplistServiceExpired);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getToplistServiceExpiring: async(req, res) => {
    try {
      var currentDate = new Date();
      var dateExpired = dayjs(currentDate).add(30, 'day');
      var toplistServiceExpiring = await ToplistServices.find(
        {
          expiredAt: {
            $gte: dayjs(currentDate).startOf('day').toDate(),
            $lte: dayjs(dateExpired).endOf('day').toDate()
          }
        }
      );

      for (const item of toplistServiceExpiring) {
        try {
          toplistServiceExpiring = await ToplistServices.findByIdAndUpdate(
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

      toplistServiceExpiring = await ToplistServices
        .find(
          {
            expiredAt: {
              $gte: dayjs(currentDate).startOf('day').toDate(),
              $lte: dayjs(dateExpired).endOf('day').toDate()
            }
          }
        )
        .sort({"createdAt": -1})
        .populate('customer_id', 'fullname gender email phone');
      
      return res.status(200).json(toplistServiceExpiring);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getToplistServiceByCustomerId: async(req, res) => {
    try {
      const customer_id = req.params.customer_id;
      const toplistService = await ToplistServices
        .find(
          {
            customer_id: customer_id
          }
        )
        .sort({"createdAt": -1});
      
      return res.status(200).json(toplistService);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = toplistServiceController;