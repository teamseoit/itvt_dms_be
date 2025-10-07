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
      // tài khoản
        // xem tài khoản
        {
          _id: new ObjectId("668653c9e55c5173ec41c920"),
          permission_id: new ObjectId("66746193cb45907845ee9f36"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo tài khoản
        {
          _id: new ObjectId("668653c9e55c5173ec41c919"),
          permission_id: new ObjectId("66746193cb45907845239f36"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa tài khoản
        {
          _id: new ObjectId("668653c9e55c5173ec41c91d"),
          permission_id: new ObjectId("66746193cb45907845239f38"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // cập nhật mật khẩu tài khoản
        {
          _id: new ObjectId("66746193cb45905845239f39"),
          permission_id: new ObjectId("66746193cb45907845239f37"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa tài khoản
        {
          _id: new ObjectId("668653c9e55c5173ec41c91f"),
          permission_id: new ObjectId("66746193cb45907845239f50"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem nhóm quyền
        {
          _id: new ObjectId("668653c9e55c5173ec41c921"),
          permission_id: new ObjectId("66746193cb45907845fe9f39"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo nhóm quyền
        {
          _id: new ObjectId("66746193cb45907845fe9f40"),
          permission_id: new ObjectId("66746193cb45907845239f39"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa nhóm quyền
        {
          _id: new ObjectId("668653c9e55c5173ec41c923"),
          permission_id: new ObjectId("66746193cb45907845239f3a"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa nhóm quyền
        {
          _id: new ObjectId("668653c9e55c5173ec41c925"),
          permission_id: new ObjectId("66746193cb45907845239f4a"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },

      // khách hàng
        // xem khách hàng
        {
          _id: new ObjectId("668653c9e55c5173ec41f93d"),
          permission_id: new ObjectId("667463d04bede188dfb46f7f"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo khách hàng
        {
          _id: new ObjectId("668653c9e55c5173ec41c939"),
          permission_id: new ObjectId("667463d04bede188dfb46d7e"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa khách hàng
        {
          _id: new ObjectId("668653c9e55c5173ec41c93b"),
          permission_id: new ObjectId("667463d04bede188dfb46d7f"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa khách hàng
        {
          _id: new ObjectId("668653c9e55c5173ec41c93d"),
          permission_id: new ObjectId("667463d04bede188dfb46b7f"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },

      // nhà cung
        // xem nhà cung cấp dịch vụ
        {
          _id: new ObjectId("667463d04bede188dfbee478"),
          permission_id: new ObjectId("667463d04bede188dfb46e78"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo nhà cung cấp dịch vụ
        {
          _id: new ObjectId("668653c9e55c5173ec41c927"),
          permission_id: new ObjectId("667463d04bede188dfb46d76"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa nhà cung cấp dịch vụ
        {
          _id: new ObjectId("668653c9e55c5173ec41c929"),
          permission_id: new ObjectId("667463d04bede188dfb46d77"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa nhà cung cấp dịch vụ
        {
          _id: new ObjectId("668653c9e55c5173ec41c92b"),
          permission_id: new ObjectId("667463d04bede188dfb46d78"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem nhà cung cấp mạng
        {
          _id: new ObjectId("668653c9e55c5123ec41c92d"),
          permission_id: new ObjectId("667463d04bede188deb46e81"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo nhà cung cấp mạng
        {
          _id: new ObjectId("668653c9e55c5173ec41c92d"),
          permission_id: new ObjectId("667463d04bede188dfb46d79"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa nhà cung cấp mạng
        {
          _id: new ObjectId("668653c9e55c5173ec41c92f"),
          permission_id: new ObjectId("667463d04bede188dfb46d80"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa nhà cung cấp mạng
        {
          _id: new ObjectId("668653c9e55c5173ec41c931"),
          permission_id: new ObjectId("667463d04bede188dfb46d81"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem nhà cung cấp server
        {
          _id: new ObjectId("668653c9e55c5173ec41f937"),
          permission_id: new ObjectId("667463d04bede188dfb46b81"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo nhà cung cấp server
        {
          _id: new ObjectId("668653c9e55c5173ec41c933"),
          permission_id: new ObjectId("667463d04bede188dfb46a81"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa nhà cung cấp server
        {
          _id: new ObjectId("668653c9e55c5173ec41c935"),
          permission_id: new ObjectId("667463d04bede188dfb46e81"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa nhà cung cấp sever
        {
          _id: new ObjectId("668653c9e55c5173ec41c937"),
          permission_id: new ObjectId("667463d04bede188dfb46f81"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
      // end nhà cung cấp

      // gói dịch vụ
        // xem gói tên miền
        {
          _id: new ObjectId("668653c9e55c5173ec41a94f"),
          permission_id: new ObjectId("66746678f7f723b779b1a061"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo gói tên miền
        {
          _id: new ObjectId("668653c9e55c5173ec41c945"),
          permission_id: new ObjectId("66746678f7f723b779b1b05f"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa gói tên miền
        {
          _id: new ObjectId("668653c9e55c5173ec41c94b"),
          permission_id: new ObjectId("66746678f7f723b779b1b060"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa gói tên miền
        {
          _id: new ObjectId("668653c9e55c5173ec41c94d"),
          permission_id: new ObjectId("66746678f7f723b779b1b061"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem gói hosting
        {
          _id: new ObjectId("668653c9e55c5173ec41a95b"),
          permission_id: new ObjectId("66746678f7f723b779b1a065"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo gói hosting
        {
          _id: new ObjectId("668653c9e55c5173ec41c953"),
          permission_id: new ObjectId("66746678f7f723b779b1b062"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa gói hosting
        {
          _id: new ObjectId("668653c9e55c5173ec41c955"),
          permission_id: new ObjectId("66746678f7f723b779b1b063"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa gói hosting
        {
          _id: new ObjectId("668653c9e55c5173ec41c95b"),
          permission_id: new ObjectId("66746678f7f723b779b1b064"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem gói email
        {
          _id: new ObjectId("668653c9e55c5173ec41a965"),
          permission_id: new ObjectId("66746678f7f723b779b1a067"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo gói email
        {
          _id: new ObjectId("668653c9e55c5173ec41a95d"),
          permission_id: new ObjectId("66746678f7f723b779b1b065"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa gói email
        {
          _id: new ObjectId("668653c9e55c5173ec41c963"),
          permission_id: new ObjectId("66746678f7f723b779b1b066"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa gói email
        {
          _id: new ObjectId("668653c9e55c5173ec41c965"),
          permission_id: new ObjectId("66746678f7f723b779b1b067"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem gói ssl
        {
          _id: new ObjectId("668653c9e55c5173ec41a973"),
          permission_id: new ObjectId("66746678f7f723b779b1a06a"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo gói ssl
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
        // xóa gói ssl
        {
          _id: new ObjectId("668653c9e55c5173ec41c973"),
          permission_id: new ObjectId("66746678f7f723b779b1b06a"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem gói viết bài content & PR
        {
          _id: new ObjectId("668653c9e55c5173ec41a976"),
          permission_id: new ObjectId("66746678f7f723b779b1a06e"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo gói viết bài content & PR
        {
          _id: new ObjectId("668653c9e55c5173ec41c971"),
          permission_id: new ObjectId("66746678f7f723b779b1b06b"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa gói viết bài content & PR
        {
          _id: new ObjectId("668653c9e55c5173ec41c975"),
          permission_id: new ObjectId("66746678f7f723b779b1b06c"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa gói viết bài content & PR
        {
          _id: new ObjectId("668653c9e55c5173ec41c976"),
          permission_id: new ObjectId("66746678f7f723b779b1b06d"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem gói bảo trì
        {
          _id: new ObjectId("668653c9e55c5173ec41a97d"),
          permission_id: new ObjectId("66746678f7f723b779b1a070"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo gói bảo trì
        {
          _id: new ObjectId("668653c9e55c5173ec41c979"),
          permission_id: new ObjectId("66746678f7f723b779b1b06e"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa gói bảo trì
        {
          _id: new ObjectId("668653c9e55c5173ec41c97b"),
          permission_id: new ObjectId("66746678f7f723b779b1b06f"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa gói bảo trì
        {
          _id: new ObjectId("668653c9e55c5173ec41c97d"),
          permission_id: new ObjectId("66746678f7f723b779b1b070"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem gói mạng
        {
          _id: new ObjectId("668653c9e55c5173ec41a983"),
          permission_id: new ObjectId("66746678f7f723b779b1a073"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo gói mạng
        {
          _id: new ObjectId("668653c9e55c5173ec41c97f"),
          permission_id: new ObjectId("66746678f7f723b779b1b071"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa gói mạng
        {
          _id: new ObjectId("668653c9e55c5173ec41c981"),
          permission_id: new ObjectId("66746678f7f723b779b1b072"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa gói mạng
        {
          _id: new ObjectId("668653c9e55c5173ec41c983"),
          permission_id: new ObjectId("66746678f7f723b779b1b073"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem gói server
        {
          _id: new ObjectId("668653c9e55c5173ec41a989"),
          permission_id: new ObjectId("66746678f7f723b779b1a075"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo gói server
        {
          _id: new ObjectId("668653c9e55c5173ec41c985"),
          permission_id: new ObjectId("66746678f7f723b779b1b074"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa gói server
        {
          _id: new ObjectId("668653c9e55c5173ec41c987"),
          permission_id: new ObjectId("66746678f7f723b779b1b075"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa gói server
        {
          _id: new ObjectId("668653c9e55c5173ec41c989"),
          permission_id: new ObjectId("66746678f7f723b779b1b076"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem gói toplist
        {
          _id: new ObjectId("668653c9e55c5173ae41a985"),
          permission_id: new ObjectId("66746678f7f500b779b1e084"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // tạo gói toplist
        {
          _id: new ObjectId("668653c9e55c5173ae41a982"),
          permission_id: new ObjectId("66746678f7f500b779b1e081"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa gói toplist
        {
          _id: new ObjectId("668653c9e55c5173ae41a983"),
          permission_id: new ObjectId("66746678f7f500b779b1e082"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa gói toplist
        {
          _id: new ObjectId("668653c9e55c5173ae41a984"),
          permission_id: new ObjectId("66746678f7f500b779b1e083"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
    // end gói dịch vụ
  
    // dịch vụ
      // xem dịch vụ tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41a991"),
        permission_id: new ObjectId("667467eb263fb998b9925a30"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // tạo dịch vụ tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41c994"),
        permission_id: new ObjectId("667467eb263fb998b9925d2e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa dịch vụ tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41d995"),
        permission_id: new ObjectId("667467eb263fb998b9925d2f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xóa dịch vụ tên miền
      {
        _id: new ObjectId("668653c9e55c5173ec41d997"),
        permission_id: new ObjectId("667467eb263fb998b9925d30"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xem dịch vụ hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41a993"),
        permission_id: new ObjectId("667467eb263fb998b9925a33"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // tạo dịch vụ hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41d999"),
        permission_id: new ObjectId("667467eb263fb998b9925d31"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa dịch vụ hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41d99b"),
        permission_id: new ObjectId("667467eb263fb998b9925d32"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xóa dịch vụ hosting
      {
        _id: new ObjectId("668653c9e55c5173ec41d99d"),
        permission_id: new ObjectId("667467eb263fb998b9925d33"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xem dịch vụ email
      {
        _id: new ObjectId("668653c9e55c5173ec41a999"),
        permission_id: new ObjectId("667467eb263fb998b9925a36"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // tạo dịch vụ email
      {
        _id: new ObjectId("668653c9e55c5173ec41c79b"),
        permission_id: new ObjectId("667467eb263fb998b9925d34"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa dịch vụ email
      {
        _id: new ObjectId("668653c9e55c5173ec41c69d"),
        permission_id: new ObjectId("667467eb263fb998b9925d35"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xóa dịch vụ email
      { 
        _id: new ObjectId("668653c9e55c5173ec41c89f"),
        permission_id: new ObjectId("667467eb263fb998b9925d36"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xem dịch vụ ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41a995"),
        permission_id: new ObjectId("667467eb263fb998b9925a39"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // tạo dịch vụ ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41a996"),
        permission_id: new ObjectId("667467eb263fb998b9925d37"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa dịch vụ ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41a994"),
        permission_id: new ObjectId("667467eb263fb998b9925d38"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xóa dịch vụ ssl
      {
        _id: new ObjectId("668653c9e55c5173ec41a998"),
        permission_id: new ObjectId("667467eb263fb998b9925d39"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xem dịch vụ website
      {
        _id: new ObjectId("668653c9e55c5173ec41a9a9"),
        permission_id: new ObjectId("667467eb263fb998b9925a48"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // tạo dịch vụ website
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a5"),
        permission_id: new ObjectId("667467eb263fb998b9925d46"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa dịch vụ website
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a7"),
        permission_id: new ObjectId("667467eb263fb998b9925d47"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xóa dịch vụ website
      {
        _id: new ObjectId("668653c9e55c5173ec41c9a9"),
        permission_id: new ObjectId("667467eb263fb998b9925d48"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },

      // ITVT dịch vụ
      // xem dịch vụ tên miền ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9aa"),
        permission_id: new ObjectId("667467eb263fb998b9925d49"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // tạo dịch vụ tên miền ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9ab"),
        permission_id: new ObjectId("667467eb263fb998b9925d4a"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa dịch vụ tên miền ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9ac"),
        permission_id: new ObjectId("667467eb263fb998b9925d4b"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xóa dịch vụ tên miền ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9ad"),
        permission_id: new ObjectId("667467eb263fb998b9925d4c"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xem dịch vụ hosting ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9ae"),
        permission_id: new ObjectId("667467eb263fb998b9925d4d"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // tạo dịch vụ hosting ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9af"),
        permission_id: new ObjectId("667467eb263fb998b9925d4e"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa dịch vụ hosting ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b0"),
        permission_id: new ObjectId("667467eb263fb998b9925d4f"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xóa dịch vụ hosting ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b1"),
        permission_id: new ObjectId("667467eb263fb998b9925d50"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xem dịch vụ SSL ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b2"),
        permission_id: new ObjectId("667467eb263fb998b9925d51"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // tạo dịch vụ SSL ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b3"),
        permission_id: new ObjectId("667467eb263fb998b9925d52"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa dịch vụ SSL ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b4"),
        permission_id: new ObjectId("667467eb263fb998b9925d53"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xóa dịch vụ SSL ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b5"),
        permission_id: new ObjectId("667467eb263fb998b9925d54"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xem dịch vụ Email ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b6"),
        permission_id: new ObjectId("667467eb263fb998b9925d55"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // tạo dịch vụ Email ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b7"),
        permission_id: new ObjectId("667467eb263fb998b9925d56"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // sửa dịch vụ Email ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b8"),
        permission_id: new ObjectId("667467eb263fb998b9925d57"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      // xóa dịch vụ Email ITVT
      {
        _id: new ObjectId("668653c9e55c5173ec41c9b9"),
        permission_id: new ObjectId("667467eb263fb998b9925d58"),
        group_user_id: new ObjectId("6684196550a34692df218d8d"),
      },
      


      

      // chưa làm
      // //Tạo dịch vụ viết bài content & PR
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c98d"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d3a"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Sửa dịch vụ viết bài content & PR
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c98f"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d3b"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Xóa dịch vụ viết bài content & PR
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c991"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d3c"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Tạo dịch vụ bảo trì
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c993"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d3d"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Sửa dịch vụ bảo trì
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c995"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d3e"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Xóa dịch vụ bảo trì
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c997"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d3f"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Xem dịch vụ bảo trì
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41a997"),
      //   permission_id: new ObjectId("667467eb263fb998b9925a3f"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Tạo dịch vụ sim 4G
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c999"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d40"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Sửa dịch vụ sim 4G
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c99b"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d41"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Xóa dịch vụ sim 4G
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c99d"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d42"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // // Xem dịch vụ sim 4G
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41a99d"),
      //   permission_id: new ObjectId("667467eb263fb998b9925a42"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Tạo dịch vụ toplist
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c99f"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d43"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Sửa dịch vụ toplist
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c9a1"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d44"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Xóa dịch vụ toplist
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41c9a3"),
      //   permission_id: new ObjectId("667467eb263fb998b9925d45"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      // //Xem dịch vụ toplist
      // {
      //   _id: new ObjectId("668653c9e55c5173ec41a9a3"),
      //   permission_id: new ObjectId("667467eb263fb998b9925a45"),
      //   group_user_id: new ObjectId("6684196550a34692df218d8d"),
      // },
      

      // hợp đồng
        // xem hợp đồng
        {
          _id: new ObjectId("669653c9e55c5173ec41c93f"),
          permission_id: new ObjectId("667463d04bede188eee46d7b"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // sửa hợp đồng
        {
          _id: new ObjectId("668653c9e55c5173ec41c54f"),
          permission_id: new ObjectId("667463d04bede188dfb4610c"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xóa hợp đồng
        {
          _id: new ObjectId("668653c9e55c5173ec41c941"),
          permission_id: new ObjectId("667463d04bede188dfb46c7c"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
      // end hợp đồng

      // backups
        // xem thống kê
        {
          _id: new ObjectId("674153c9e55c5173ec41c9b1"),
          permission_id: new ObjectId("643263d04bede188dfb46d77"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem sao lưu dữ liệu
        {
          _id: new ObjectId("674153c9e55c5173ec41c9b2"),
          permission_id: new ObjectId("643263d04bede188dfb46d78"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
        // xem lịch sử thao tác
        {
          _id: new ObjectId("674153c9e55c5173ec41c9b3"),
          permission_id: new ObjectId("643263d04bede188dfb46d79"),
          group_user_id: new ObjectId("6684196550a34692df218d8d"),
        },
      // end backups
      
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