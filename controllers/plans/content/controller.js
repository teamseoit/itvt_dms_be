const ContentPlans = require("../../../models/plans/content/model");
const logAction = require("../../../middleware/action_logs");

const contentPlansController = {
  addContentPlans: async(req, res) => {
    try {
      const {name} = req.body;
      const existingName = await ContentPlans.findOne({name});
      if (existingName) {
        let errorMessage = '';
        if (existingName.name === name) {
          errorMessage = 'Tên gói đã tồn tại! Vui lòng nhập tên khác!';
        }
        return res.status(400).json({message: errorMessage});
      }
      const newContentPlans = new ContentPlans(req.body);
      const saveContentPlans = await newContentPlans.save();
      await logAction(req.auth._id, 'Gói DV Viết bài Content & PR', 'Thêm mới');
      return res.status(200).json(saveContentPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getContentPlans: async(req, res) => {
    try {
      const contentPlans = await ContentPlans.find().sort({"createdAt": -1});
      return res.status(200).json(contentPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  getDetailContentPlans: async(req, res) => {
    try {
      const contentPlans = await ContentPlans.findById(req.params.id);
      return res.status(200).json(contentPlans);
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  deleteContentPlans: async(req, res) => {
    try {
      await ContentPlans.findByIdAndDelete(req.params.id);
      await logAction(req.auth._id, 'Gói DV Viết bài Content & PR', 'Xóa');
      return res.status(200).json("Xóa thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  },

  updateContentPlans: async(req, res) => {
    try {
      const contentPlans = await ContentPlans.findById(req.params.id);
      if (!contentPlans) {
        return res.status(404).json({ message: "Tên gói content không tồn tại!" });
      }

      const { name } = req.body;
      if (name && name !== contentPlans.name) {
        const existingContentPlanName = await ContentPlans.findOne({ name });
        if (existingContentPlanName) {
          return res.status(400).json({ message: "Tên gói content đã tồn tại! Vui lòng nhập tên khác!" });
        }
      }

      await contentPlans.updateOne({$set: req.body});
      await logAction(req.auth._id, 'Gói DV Viết bài Content & PR', 'Cập nhật', `/trang-chu/goi-dich-vu/cap-nhat-content/${req.params.id}`);
      return res.status(200).json("Cập nhật thành công!");
    } catch(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  }
}

module.exports = contentPlansController;