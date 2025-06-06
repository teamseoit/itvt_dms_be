const GroupUsers = require('../../models/group-user/model');
const Roles = require('../../models/roles/model');
const {ObjectId} = require('mongoose').Types

const roleController = {
  addRole: async(req, res) => {
    try {
      const {name, description, group} = req.body;

      if (!name) throw new Error(`Vui lòng nhập tên nhóm!`)     
      if (!description) throw new Error(`Mô tả không được trống!`)

      const existingName = await GroupUsers.findOne({name: name});
      if (existingName) return res.status(400).json({ message: 'Tên nhóm đã tồn tại! Vui lòng chọn tên khác!' });

      const data_group = await new GroupUsers({
        name: name,
        description: description
      }).save()

      for (let i =0; i<group.length; i++) {
        await Roles.findOneAndUpdate({
          $and:[
            {function_id: new ObjectId(group[i])},
            {group_user_id: data_group._id}
          ]
        },{
          function_id: new ObjectId(group[i]),
          group_user_id: data_group._id
        }, {upsert:true})
      }

      return res.json("Thêm thành công!");
    } catch(err) {
      console.error(err);
      return res.status(400).send(err.message);
    }
  },
  getRoles: async(req, res) => {
    try {
      const roles = await Roles.find();
      return res.status(200).json(roles);
    } catch(err) {
      console.error(err);
      return res.status(400).send(err.message);
    }
  },
  getRolesByGroupUserId: async(req, res) => {
    try {
      const roles = await Roles.find({ group_user_id: req.params.group_user_id });
      return res.status(200).json(roles);
    } catch(err) {
      console.error(err);
      return res.status(400).send(err.message);
    }
  }
}

module.exports = roleController;