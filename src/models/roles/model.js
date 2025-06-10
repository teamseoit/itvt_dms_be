const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const roleSchema = new mongoose.Schema({
  permission_id: {
    type: ObjectId,
    required: true,
    index: true
  },
  group_user_id:{
    type: ObjectId,
    required: true,
    index: true
  }
});

const Roles = mongoose.model("Roles", roleSchema);
module.exports = Roles;

const init = async () => {
  const count = await Roles.estimatedDocumentCount();
  if (count == 0) {
    const array = [
      // tao tai khoảnm 
      {
        _id: new ObjectId("668653c9e55c5173ec41c919"),
        permission_id: new ObjectId("66746193cb45907845239f36"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sưa tai khoan
      {
        _id: new ObjectId("668653c9e55c5173ec41c91b"),
        permission_id: new ObjectId("66746193cb45907845239f37"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa tài khoản
      {
        _id: new ObjectId("668653c9e55c5173ec41c91d"),
        permission_id: new ObjectId("66746193cb45907845239f38"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa tài khoản
      {
        _id: new ObjectId("668653c9e55c5173ec41c91f"),
        permission_id: new ObjectId("66746193cb45907845239f50"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo nhóm quyền
      {
        _id: new ObjectId("668653c9e55c5173ec41c921"),
        permission_id: new ObjectId("66746193cb45907845239f39"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //sửa nhóm quyền
      {
        _id: new ObjectId("668653c9e55c5173ec41c923"),
        permission_id: new ObjectId("66746193cb45907845239f3a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa nhóm quyền
      {
        _id: new ObjectId("668653c9e55c5173ec41c925"),
        permission_id: new ObjectId("66746193cb45907845239f4a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //tạo nhà cung cấp
      {
        _id: new ObjectId("668653c9e55c5173ec41c927"),
        permission_id: new ObjectId("667463d04bede188dfb46d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa nhà cung cấp
      {
        _id: new ObjectId("668653c9e55c5173ec41c929"),
        permission_id: new ObjectId("667463d04bede188dfb46d77"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa nhà cung cấp
      {
        _id: new ObjectId("668653c9e55c5173ec41c92b"),
        permission_id: new ObjectId("667463d04bede188dfb46d78"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem nhà cung cấp
      {
        _id: new ObjectId("667463d04bede188dfbee478"),
        permission_id: new ObjectId("667463d04bede188dfb46e78"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo nhà mạng
      {
        _id: new ObjectId("668653c9e55c5173ec41c92d"),
        permission_id: new ObjectId("667463d04bede188dfb46d79"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //sửa nhà mạng
      {
        _id: new ObjectId("668653c9e55c5173ec41c92f"),
        permission_id: new ObjectId("667463d04bede188dfb46d80"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa nhà mạng
      {
        _id: new ObjectId("668653c9e55c5173ec41c931"),
        permission_id: new ObjectId("667463d04bede188dfb46d81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem nhà mạng
      {
        _id: new ObjectId("667463d04bede188dfb22e81"),
        permission_id: new ObjectId("667463d04bede188deb46e81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo server
      {
        _id: new ObjectId("668653c9e55c5173ec41c933"),
        permission_id: new ObjectId("667463d04bede188dfb46a81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa server
      {
        _id: new ObjectId("668653c9e55c5173ec41c935"),
        permission_id: new ObjectId("667463d04bede188dfb46e81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa sever
      {
        _id: new ObjectId("668653c9e55c5173ec41c937"),
        permission_id: new ObjectId("667463d04bede188dfb46f81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem server
      {
        _id: new ObjectId("668653c9e55c5173ec41f937"),
        permission_id: new ObjectId("667463d04bede188dfb46b81"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo khách hàng
      {
        _id: new ObjectId("668653c9e55c5173ec41c939"),
        permission_id: new ObjectId("667463d04bede188dfb46d7e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //sửa khách hàng
      {
        _id: new ObjectId("668653c9e55c5173ec41c93b"),
        permission_id: new ObjectId("667463d04bede188dfb46d7f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa khách hàng
      {
        _id: new ObjectId("668653c9e55c5173ec41c93d"),
        permission_id: new ObjectId("667463d04bede188dfb46b7f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xem khách hàng
      {
        _id: new ObjectId("668653c9e55c5173ec41f93d"),
        permission_id: new ObjectId("667463d04bede188dfb46f7f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //tạo hợp đồng
      {
        _id: new ObjectId("668653c9e55c5173ec41c93f"),
        permission_id: new ObjectId("667463d04bede188dfb46d7b"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //sửa hợp đồng
      {
        _id: new ObjectId("668653c9e55c5173ec41c54f"),
        permission_id: new ObjectId("667463d04bede188dfb4610c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //gia hạn hợp đồng
      {
        _id: new ObjectId("668653c9e55c5173ec41c941"),
        permission_id: new ObjectId("667463d04bede188dfb46d7c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },

      //xóa hợp đồng( đã bị comment bên permissions->model.js)
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c943"),
      //   permission_id: new ObjectId("667463d04bede188dfb46c7c"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },

      //dịch vụ ITVT
      //tạo dịch vụ tên miền ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c941"),
        permission_id: new ObjectId("6684196550a36692df218d8d"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //sửa dịch vụ tên miền ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c942"),
        permission_id: new ObjectId("66746678f7f723b779f9e31"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa dịch vụ tên miền ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c943"),
        permission_id: new ObjectId("66746678f7f723b779k9e32"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xem dịch vụ tên miền ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c944"),
        permission_id: new ObjectId("66746678f7f723b779k9e33"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //tạo dịch vụ hosting ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c945"),
        permission_id: new ObjectId("66746678f7f723b779k9e49"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //sửa dịch vụ hosting ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c946"),
        permission_id: new ObjectId("66746678f7f723b779k9e41"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa dịch vụ hosting ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c947"),
        permission_id: new ObjectId("66746678f7f723b779k9e42"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xem dịch vụ hosting ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c948"),
        permission_id: new ObjectId("66746678f7f723b779k9e43"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //tạo dịch vụ email ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c951"),
        permission_id: new ObjectId("66746678f7f723b779k9e59"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //sửa dịch vụ email ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c952"),
        permission_id: new ObjectId("66746678f7f723b779k9e51"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa dịch vụ email ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c953"),
        permission_id: new ObjectId("66746678f7f723b779k9e52"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xem dịch vụ email ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c954"),
        permission_id: new ObjectId("66746678f7f723b779k9e53"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //tạo dịch vụ ssl ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c961"),
        permission_id: new ObjectId("66746678f7f723b779k9e69"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //sửa dịch vụ ssl ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c962"),
        permission_id: new ObjectId("66746678f7f723b779k9e61"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa dịch vụ ssl ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c963"),
        permission_id: new ObjectId("66746678f7f723b779k9e62"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xem dịch vụ ssl ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec51c964"),
        permission_id: new ObjectId("66746678f7f723b779k9e63"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },

      //tạo gói tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41c945"),
        permission_id: new ObjectId("66746678f7f723b779b1b05f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo dịch vụ tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41c947"),
        permission_id: new ObjectId("667467eb263fb998b9925d2e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa dịch vụ tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41c949"),
        permission_id: new ObjectId("667467eb263fb998b9925d2f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa gói tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41c94b"),
        permission_id: new ObjectId("66746678f7f723b779b1b060"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa gói tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41c94d"),
        permission_id: new ObjectId("66746678f7f723b779b1b061"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa dịch vụ tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41c94f"),
        permission_id: new ObjectId("667467eb263fb998b9925d30"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // Xem gói tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41k94f"),
        permission_id: new ObjectId("66746678f7f723b779b1k061"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem dịch vụ tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41v94f"),
        permission_id: new ObjectId("667467eb263fb998b9925k30"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo dịch vụ hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41c951"),
        permission_id: new ObjectId("667467eb263fb998b9925d31"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo gói hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41c953"),
        permission_id: new ObjectId("66746678f7f723b779b1b062"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa gói hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41c955"),
        permission_id: new ObjectId("66746678f7f723b779b1b063"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa dịch vụ hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41c957"),
        permission_id: new ObjectId("667467eb263fb998b9925d32"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa dịch vụ hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41c959"),
        permission_id: new ObjectId("667467eb263fb998b9925d33"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //xóa gói hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41c95b"),
        permission_id: new ObjectId("66746678f7f723b779b1b064"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem gói hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41k95b"),
        permission_id: new ObjectId("66746678f7f723b779b1k065"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem dịch vụ hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41k96b"),
        permission_id: new ObjectId("667467eb263fb998b9925k33"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo gói email
      {
        _id: new ObjectId("668653c9e55c5173ec41k95d"),
        permission_id: new ObjectId("66746678f7f723b779b1k064"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo dịch vụ email
      {
        _id: new ObjectId("668653c9e55c5173ec41c95f"),
        permission_id: new ObjectId("667467eb263fb998b9925d34"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa dịch vụ email
      {
        _id: new ObjectId("668653c9e55c5173ec41c961"),
        permission_id: new ObjectId("667467eb263fb998b9925d35"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa gói emai
      {
        _id: new ObjectId("668653c9e55c5173ec41c963"),
        permission_id: new ObjectId("66746678f7f723b779b1b066"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa gói email
      {
        _id: new ObjectId("668653c9e55c5173ec41c965"),
        permission_id: new ObjectId("66746678f7f723b779b1b067"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa dịch vụ email
      {
        _id: new ObjectId("668653c9e55c5173ec41c967"),
        permission_id: new ObjectId("667467eb263fb998b9925d36"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem gói email
      {
        _id: new ObjectId("668653c9e55c5173ec41k965"),
        permission_id: new ObjectId("66746678f7f723b779b1k067"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem dịch vụ email
      {
        _id: new ObjectId("668653c9e55c5173ec41k966"),
        permission_id: new ObjectId("667467eb263fb998b9925k36"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo dịch vụ ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41c969"),
        permission_id: new ObjectId("667467eb263fb998b9925d37"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo gói ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41c96b"),
        permission_id: new ObjectId("66746678f7f723b779b1b068"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa gói ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41c96d"),
        permission_id: new ObjectId("66746678f7f723b779b1b069"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa dịch vụ ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41c96f"),
        permission_id: new ObjectId("667467eb263fb998b9925d38"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa gói ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41c973"),
        permission_id: new ObjectId("66746678f7f723b779b1b06a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem gói ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41k973"),
        permission_id: new ObjectId("66746678f7f723b779b1k06a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem dịch vụ ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41k986"),
        permission_id: new ObjectId("667467eb263fb998b9925k39"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo gói viết bài content & PR
      {
        _id: new ObjectId("668653c9e55c5173ec41c971"),
        permission_id: new ObjectId("66746678f7f723b779b1b06b"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      
      //Sửa gói viết bài content & PR
      {
        _id: new ObjectId("668653c9e55c5173ec41c975"),
        permission_id: new ObjectId("66746678f7f723b779b1b06c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa gói viết bài content & PR
      {
        _id: new ObjectId("668653c9e55c5173ec41c976"),
        permission_id: new ObjectId("66746678f7f723b779b1b06d"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // Xem gói viết bài content & PR
      {
        _id: new ObjectId("668653c9e55c5173ec41k976"),
        permission_id: new ObjectId("66746678f7f723b779b1b06k"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem dịch vụ viết bài content & PR
      {
        _id: new ObjectId("668653c9e55c5173ec41k996"),
        permission_id: new ObjectId("667467eb263fb998b9925k3c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo tài khoản mới
      {
        _id: new ObjectId("668653c9e55c5173ec41c977"),
        permission_id: new ObjectId("66746193cb45907845239f36"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo gói bảo trì
      {
        _id: new ObjectId("668653c9e55c5173ec41c979"),
        permission_id: new ObjectId("66746678f7f723b779b1b06e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa gói bảo trì
      {
        _id: new ObjectId("668653c9e55c5173ec41c97b"),
        permission_id: new ObjectId("66746678f7f723b779b1b06f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa gói bảo trì
      {
        _id: new ObjectId("668653c9e55c5173ec41c97d"),
        permission_id: new ObjectId("66746678f7f723b779b1b070"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem gói bảo trì
      {
        _id: new ObjectId("668653c9e55c5173ec41k97d"),
        permission_id: new ObjectId("66746678f7f723b779b1k070"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo gói sim 4G
      {
        _id: new ObjectId("668653c9e55c5173ec41c97f"),
        permission_id: new ObjectId("66746678f7f723b779b1b071"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa gói sim 4G
      {
        _id: new ObjectId("668653c9e55c5173ec41c981"),
        permission_id: new ObjectId("66746678f7f723b779b1b072"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa gói sim 4G
      {
        _id: new ObjectId("668653c9e55c5173ec41c983"),
        permission_id: new ObjectId("66746678f7f723b779b1b073"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem gói sim 4G
      {
        _id: new ObjectId("668653c9e55c5173ec41k983"),
        permission_id: new ObjectId("66746678f7f723b779b1k073"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo server
      {
        _id: new ObjectId("668653c9e55c5173ec41c985"),
        permission_id: new ObjectId("66746678f7f723b779b1b074"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa server
      {
        _id: new ObjectId("668653c9e55c5173ec41c987"),
        permission_id: new ObjectId("66746678f7f723b779b1b075"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa server
      {
        _id: new ObjectId("668653c9e55c5173ec41c989"),
        permission_id: new ObjectId("66746678f7f723b779b1b076"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem server
      {
        _id: new ObjectId("668653c9e55c5173ec41k989"),
        permission_id: new ObjectId("66746678f7f723b779b1k075"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo gói toplist
      {
        _id: new ObjectId("668653c9e55c5173ae41k982"),
        permission_id: new ObjectId("66746678f7f500b779b1e081"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa gói toplist
      {
        _id: new ObjectId("668653c9e55c5173ae41k983"),
        permission_id: new ObjectId("66746678f7f500b779b1e082"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa gói toplist
      {
        _id: new ObjectId("668653c9e55c5173ae41k984"),
        permission_id: new ObjectId("66746678f7f500b779b1e083"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem gói toplist
      {
        _id: new ObjectId("668653c9e55c5173ae41k985"),
        permission_id: new ObjectId("66746678f7f500b779b1e084"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa dịch vụ ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41c98b"),
        permission_id: new ObjectId("667467eb263fb998b9925d39"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo dịch vụ viết bài content & PR
      {
        _id: new ObjectId("668653c9e55c5173ec41c98d"),
        permission_id: new ObjectId("667467eb263fb998b9925d3a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa dịch vụ viết bài content & PR
      {
        _id: new ObjectId("668653c9e55c5173ec41c98f"),
        permission_id: new ObjectId("667467eb263fb998b9925d3b"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa dịch vụ viết bài content & PR
      {
        _id: new ObjectId("668653c9e55c5173ec41c991"),
        permission_id: new ObjectId("667467eb263fb998b9925d3c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo dịch vụ bảo trì
      {
        _id: new ObjectId("668653c9e55c5173ec41c993"),
        permission_id: new ObjectId("667467eb263fb998b9925d3d"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa dịch vụ bảo trì
      {
        _id: new ObjectId("668653c9e55c5173ec41c995"),
        permission_id: new ObjectId("667467eb263fb998b9925d3e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa dịch vụ bảo trì
      {
        _id: new ObjectId("668653c9e55c5173ec41c997"),
        permission_id: new ObjectId("667467eb263fb998b9925d3f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem dịch vụ bảo trì
      {
        _id: new ObjectId("668653c9e55c5173ec41k997"),
        permission_id: new ObjectId("667467eb263fb998b9925k3f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo dịch vụ sim 4G
      {
        _id: new ObjectId("668653c9e55c5173ec41c999"),
        permission_id: new ObjectId("667467eb263fb998b9925d40"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa dịch vụ sim 4G
      {
        _id: new ObjectId("668653c9e55c5173ec41c99b"),
        permission_id: new ObjectId("667467eb263fb998b9925d41"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa dịch vụ sim 4G
      {
        _id: new ObjectId("668653c9e55c5173ec41c99d"),
        permission_id: new ObjectId("667467eb263fb998b9925d42"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // Xem dịch vụ sim 4G
      {
        _id: new ObjectId("668653c9e55c5173ec41k99d"),
        permission_id: new ObjectId("667467eb263fb998b9925k42"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo dịch vụ toplist
      {
        _id: new ObjectId("668653c9e55c5173ec41c99f"),
        permission_id: new ObjectId("667467eb263fb998b9925d43"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa dịch vụ toplist
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a1"),
        permission_id: new ObjectId("667467eb263fb998b9925d44"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa dịch vụ toplist
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a3"),
        permission_id: new ObjectId("667467eb263fb998b9925d45"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem dịch vụ toplist
      {
        _id: new ObjectId("668653c9e55c5173ec41k9a3"),
        permission_id: new ObjectId("667467eb263fb998b9925k45"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo dịch vụ website
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a5"),
        permission_id: new ObjectId("667467eb263fb998b9925d46"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Sửa dịch vụ website
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a7"),
        permission_id: new ObjectId("667467eb263fb998b9925d47"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xóa dịch vụ website
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a9"),
        permission_id: new ObjectId("667467eb263fb998b9925d48"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem dịch vụ website
      {
        _id: new ObjectId("668653c9e55c5173ec41k9a9"),
        permission_id: new ObjectId("667467eb263fb998b9925k48"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },

      //backups
      //Xem thống kê
      {
        _id: new ObjectId("674153c9e55c5173ec41c9b1"),
        permission_id: new ObjectId("643263d04bede188dfb46d77"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Tạo sao lưu dữ liệu
      {
        _id: new ObjectId("674153c9e55c5173ec41c9a9"),
        permission_id: new ObjectId("643263d04bede188dfb46d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem sao lưu dữ liệu
      {
        _id: new ObjectId("674153c9e55c5173ec41c9b2"),
        permission_id: new ObjectId("643263d04bede188dfb46d78"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      //Xem lịch sử thao tác
      {
        _id: new ObjectId("674153c9e55c5173ec41c9b3"),
        permission_id: new ObjectId("643263d04bede188dfb46d79"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      
      // ip whitelist
      {
        _id: new ObjectId("674153c9e55c5173ff41c9a9"),
        permission_id: new ObjectId("643263d04bede188fff66d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("674153c9e55c5173ef41c9a9"),
        permission_id: new ObjectId("643263d04bede188dff66d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      {
        _id: new ObjectId("674153c9e55c5173ee41c9a9"),
        permission_id: new ObjectId("643263d04bede188dff67d76"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
    ];
    await Roles.insertMany(array);
  }
}

init()