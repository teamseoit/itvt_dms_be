const mongoose = require("mongoose");
const sha512  = require("js-sha512");

const ObjectId = mongoose.Types.ObjectId

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    permission_parent_id:{
        type: ObjectId,
        default: null
    }
});

const Permissions = mongoose.model("Permissions", permissionSchema);
module.exports = Permissions;

const init = async () => {
  const count = await Permissions.estimatedDocumentCount()
  if (count == 0) {
    const array = [
        // tài khoản
        {
            _id: new ObjectId("667460e3d19aa9fcecc69fa6"),
            name: "Tài khoản",
        },
        {
            _id: new ObjectId("66746193cb45907845239f36"),
            permission_parent_id: new ObjectId("667460e3d19aa9fcecc69fa6"),
            name: "Tạo tài khoản mới",
        },
        {
            _id: new ObjectId("66746193cb45907845239f37"),
            permission_parent_id: new ObjectId("667460e3d19aa9fcecc69fa6"),
            name: "Cập nhật mật khẩu",
        },
        {
            _id: new ObjectId("66746193cb45907845239f38"),
            permission_parent_id: new ObjectId("667460e3d19aa9fcecc69fa6"),
            name: "Sửa tài khoản",
        },
        {
            _id: new ObjectId("66746193cb45907845239f50"),
            permission_parent_id: new ObjectId("667460e3d19aa9fcecc69fa6"),
            name: "Xóa tài khoản",
        },
        {
            _id: new ObjectId("66746193cb45907845239f39"),
            permission_parent_id: new ObjectId("667460e3d19aa9fcecc69fa6"),
            name: "Tạo nhóm quyền",
        },
        {
            _id: new ObjectId("66746193cb45907845239f3a"),
            permission_parent_id: new ObjectId("667460e3d19aa9fcecc69fa6"),
            name: "Sửa nhóm quyền",
        },
        {
            _id: new ObjectId("66746193cb45907845239f4a"),
            permission_parent_id: new ObjectId("667460e3d19aa9fcecc69fa6"),
            name: "Xóa nhóm quyền",
        },

        // nhà cung cấp
        {
            _id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Nhà cung cấp",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46d76"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Tạo nhà cung cấp",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46d77"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Sửa nhà cung cấp",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46d78"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Xóa nhà cung cấp",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46d79"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Tạo nhà mạng",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46d80"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Sửa nhà mạng",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46d81"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Xóa nhà mạng",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46a81"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Tạo server",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46e81"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Sửa server",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46f81"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d75"),
            name: "Xóa server",
        },

        
        // hợp đồng
        {
            _id: new ObjectId("667463d04bede188dfb46d7a"),
            name: "Hợp đồng",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46d7b"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d7a"),
            name: "Tạo hợp đồng",
        },
        {
            _id: new ObjectId("667463d04bede188dfb4610c"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d7a"),
            name: "Sửa hợp đồng",
        },
        // {
        //     _id: new ObjectId("667463d04bede188dfb46c7c"),
        //     permission_parent_id: new ObjectId("667463d04bede188dfb46d7a"),
        //     name: "Xóa hợp đồng",
        // },
        {
            _id: new ObjectId("667463d04bede188dfb46d7c"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d7a"),
            name: "Gia hạn hợp đồng",
        },

        // khách hàng
        {
            _id: new ObjectId("667463d04bede188dfb46d7d"),
            name: "Khách hàng",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46d7e"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d7d"),
            name: "Tạo khách hàng",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46d7f"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d7d"),
            name: "Sửa khách hàng",
        },
        {
            _id: new ObjectId("667463d04bede188dfb46b7f"),
            permission_parent_id: new ObjectId("667463d04bede188dfb46d7d"),
            name: "Xóa khách hàng",
        },

        //gói dịch vụ
        {
            _id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Gói dịch vụ",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b05f"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Tạo gói tên miền",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b060"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Sửa gói tên miền",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b061"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Xóa gói tên miền",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b062"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Tạo gói hosting",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b063"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Sửa gói hosting",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b064"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Xóa gói hosting",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b065"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Tạo gói email",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b066"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Sửa gói email",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b067"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Xóa gói email",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b068"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Tạo gói ssl",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b069"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Sửa gói ssl",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b06a"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Xóa gói ssl",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b06b"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Tạo gói viết bài content & PR",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b06c"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Sửa gói viết bài content & PR",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b06d"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Xóa gói viết bài content & PR",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b06e"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Tạo gói bảo trì",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b06f"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Sửa gói bảo trì",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b070"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Xóa gói bảo trì",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b071"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Tạo gói sim 4G",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b072"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Sửa gói sim 4G",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b073"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Xóa gói sim 4G",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b074"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Tạo server",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b075"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Sửa server",
        },
        {
            _id: new ObjectId("66746678f7f723b779b1b076"),
            permission_parent_id: new ObjectId("667464b5500bf3ad04c24f47"),
            name: "Xóa server",
        },

        //dịch vụ
        {
            _id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Dịch vụ",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d2e"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Tạo dịch vụ tên miền",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d2f"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Sửa dịch vụ tên miền",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d30"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Xóa dịch vụ tên miền",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d31"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Tạo dịch vụ hosting",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d32"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Sửa dịch vụ hosting",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d33"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Xóa dịch vụ hosting",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d34"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Tạo dịch vụ email",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d35"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Sửa dịch vụ email",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d36"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Xóa dịch vụ email",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d37"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Tạo dịch vụ ssl",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d38"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Sửa dịch vụ ssl",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d39"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Xóa dịch vụ ssl",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d3a"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Tạo dịch vụ viết bài content & PR",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d3b"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Sửa dịch vụ viết bài content & PR",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d3c"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Xóa dịch vụ viết bài content & PR",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d3d"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Tạo dịch vụ bảo trì",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d3e"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Sửa dịch vụ bảo trì",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d3f"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Xóa dịch vụ bảo trì",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d40"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Tạo dịch vụ sim 4G",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d41"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Sửa dịch vụ sim 4G",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d42"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Xóa dịch vụ sim 4G",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d43"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Tạo dịch vụ toplist",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d44"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Sửa dịch vụ toplist",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d45"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Xóa dịch vụ toplist",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d46"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Tạo dịch vụ website",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d47"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Sửa dịch vụ website",
        },
        {
            _id: new ObjectId("667467eb263fb998b9925d48"),
            permission_parent_id: new ObjectId("667467eb263fb998b9925d2d"),
            name: "Xóa dịch vụ website",
        },

        //backups
        {
            _id: new ObjectId("666523d04bede188dfb46d75"),
            name: "Sao lưu dữ liệu",
        },
        {
            _id: new ObjectId("643263d04bede188dfb46d77"),
            permission_parent_id: new ObjectId("666523d04bede188dfb46d75"),
            name: "Xem thống kê",
        },
        {
            _id: new ObjectId("643263d04bede188dfb46d76"),
            permission_parent_id: new ObjectId("666523d04bede188dfb46d75"),
            name: "Tạo sao lưu dữ liệu",
        },
        {
            _id: new ObjectId("643263d04bede188dfb46d78"),
            permission_parent_id: new ObjectId("666523d04bede188dfb46d75"),
            name: "Xem sao lưu dữ liệu",
        },
        // {
        //     _id: new ObjectId("643263d04bede188dfb46d79"),
        //     permission_parent_id: new ObjectId("666523d04bede188dfb46d75"),
        //     name: "Xem sao lưu dữ liệu",
        // },
        {
            _id: new ObjectId("643263d04bede188dfb46d79"),
            permission_parent_id: new ObjectId("666523d04bede188dfb46d75"),
            name: "Xem lịch sử thao tác",
        },
        // ip white
        {
            _id: new ObjectId("666523d04bede188dff66d75"),
            name: "IP Whitelist",
        },
        {
            _id: new ObjectId("643263d04bede188fff66d76"),
            permission_parent_id: new ObjectId("666523d04bede188dff66d75"),
            name: "Xem IP Whitelist",
        },
        {
            _id: new ObjectId("643263d04bede188dff66d76"),
            permission_parent_id: new ObjectId("666523d04bede188dff66d75"),
            name: "Tạo IP Whitelist",
        },
        {
            _id: new ObjectId("643263d04bede188dff67d76"),
            permission_parent_id: new ObjectId("666523d04bede188dff66d75"),
            name: "Xóa IP Whitelist",
        },
    ]
    await Permissions.insertMany(array)
  }
}
init()