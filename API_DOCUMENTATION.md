# API Documentation - DMS Manager 2025

## Tổng quan
Hệ thống DMS Manager 2025 cung cấp các API để quản lý dịch vụ, khách hàng, hợp đồng và thống kê. Tất cả API đều được bảo vệ bằng JWT token và phân quyền theo role.

## Base URL
```
http://localhost:{PORT}/api
```

## Authentication APIs (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Đăng nhập hệ thống | ❌ |
| POST | `/verify-otp` | Xác thực OTP | ❌ |
| POST | `/resend-otp` | Gửi lại OTP | ❌ |
| POST | `/logout` | Đăng xuất | ❌ |
| POST | `/refresh-token` | Làm mới token | ❌ |

## User Management APIs (`/api/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách người dùng | ✅ |
| POST | `/` | Tạo người dùng mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết người dùng | ✅ |
| PUT | `/:id` | Cập nhật thông tin người dùng | ✅ |
| PUT | `/change-password/:id` | Đổi mật khẩu | ✅ |
| DELETE | `/:id` | Xóa người dùng | ✅ |

## Group User APIs (`/api/group-user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách nhóm người dùng | ✅ |
| POST | `/` | Tạo nhóm người dùng mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết nhóm | ✅ |
| PUT | `/:id` | Cập nhật nhóm người dùng | ✅ |
| DELETE | `/:id` | Xóa nhóm người dùng | ✅ |

## Role & Permission APIs

### Roles (`/api/roles`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách vai trò | ✅ |
| GET | `/:group_user_id` | Lấy vai trò theo nhóm người dùng | ✅ |

### Permissions (`/api/permissions`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách quyền | ✅ |

## Customer APIs (`/api/customer`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách khách hàng | ✅ |
| POST | `/` | Tạo khách hàng mới (có upload ảnh) | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết khách hàng | ✅ |
| PUT | `/:id` | Cập nhật thông tin khách hàng (có upload ảnh) | ✅ |
| DELETE | `/:id` | Xóa khách hàng | ✅ |

## Contract APIs (`/api/contracts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách hợp đồng | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết hợp đồng | ✅ |
| PUT | `/:id` | Cập nhật hợp đồng | ✅ |
| DELETE | `/:id` | Xóa hợp đồng | ✅ |
| GET | `/:id/payment-history` | Lấy lịch sử thanh toán | ✅ |

### Chi tiết Contract APIs

#### PUT `/api/contracts/:id` - Cập nhật hợp đồng

**Request Body:**
```json
{
  "amountPaid": 1000000,
  "paymentMethod": 0,
  "paymentNote": "Thanh toán lần 1"
}
```

**Payment Method Values:**
- `0`: Chuyển khoản (mặc định)
- `1`: Tiền mặt

**Note:** `paymentMethod` là optional, nếu không cung cấp sẽ mặc định là 0 (chuyển khoản).

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật thành công!",
  "data": {
    "contractCode": "HD_1234",
    "customer": "...",
    "financials": {
      "totalAmount": 2000000,
      "amountPaid": 1000000,
      "amountRemaining": 1000000,
      "isFullyPaid": false
    }
  }
}
```

#### GET `/api/contracts/:id/payment-history` - Lấy lịch sử thanh toán

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "amount": 1000000,
      "method": 0,
      "note": "Thanh toán lần 1",
      "paymentDate": "2025-01-10T10:30:00.000Z",
      "createdBy": "admin"
    }
  ]
}
```

## Service Plan APIs

### Domain Plans (`/api/plans/domain`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách gói domain | ✅ |
| POST | `/` | Tạo gói domain mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết gói domain | ✅ |
| PUT | `/:id` | Cập nhật gói domain | ✅ |
| DELETE | `/:id` | Xóa gói domain | ✅ |

### Hosting Plans (`/api/plans/hosting`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách gói hosting | ✅ |
| POST | `/` | Tạo gói hosting mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết gói hosting | ✅ |
| PUT | `/:id` | Cập nhật gói hosting | ✅ |
| DELETE | `/:id` | Xóa gói hosting | ✅ |

### Email Plans (`/api/plans/email`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách gói email | ✅ |
| POST | `/` | Tạo gói email mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết gói email | ✅ |
| PUT | `/:id` | Cập nhật gói email | ✅ |
| DELETE | `/:id` | Xóa gói email | ✅ |

### SSL Plans (`/api/plans/ssl`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách gói SSL | ✅ |
| POST | `/` | Tạo gói SSL mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết gói SSL | ✅ |
| PUT | `/:id` | Cập nhật gói SSL | ✅ |
| DELETE | `/:id` | Xóa gói SSL | ✅ |

### Content Plans (`/api/plans/content`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách gói content | ✅ |
| POST | `/` | Tạo gói content mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết gói content | ✅ |
| PUT | `/:id` | Cập nhật gói content | ✅ |
| DELETE | `/:id` | Xóa gói content | ✅ |

### Maintenance Plans (`/api/plans/maintenance`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách gói bảo trì | ✅ |
| POST | `/` | Tạo gói bảo trì mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết gói bảo trì | ✅ |
| PUT | `/:id` | Cập nhật gói bảo trì | ✅ |
| DELETE | `/:id` | Xóa gói bảo trì | ✅ |

### Network Plans (`/api/plans/network`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách gói mạng | ✅ |
| POST | `/` | Tạo gói mạng mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết gói mạng | ✅ |
| PUT | `/:id` | Cập nhật gói mạng | ✅ |
| DELETE | `/:id` | Xóa gói mạng | ✅ |

### Server Plans (`/api/plans/server`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách gói server | ✅ |
| POST | `/` | Tạo gói server mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết gói server | ✅ |
| PUT | `/:id` | Cập nhật gói server | ✅ |
| DELETE | `/:id` | Xóa gói server | ✅ |

### Toplist Plans (`/api/plans/toplist`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách gói toplist | ✅ |
| POST | `/` | Tạo gói toplist mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết gói toplist | ✅ |
| PUT | `/:id` | Cập nhật gói toplist | ✅ |
| DELETE | `/:id` | Xóa gói toplist | ✅ |

## Service APIs

### Domain Services (`/api/services/domain`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ domain | ✅ |
| POST | `/` | Tạo dịch vụ domain mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ domain | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ domain | ✅ |
| DELETE | `/:id` | Xóa dịch vụ domain | ✅ |

### Hosting Services (`/api/services/hosting`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ hosting | ✅ |
| POST | `/` | Tạo dịch vụ hosting mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ hosting | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ hosting | ✅ |
| DELETE | `/:id` | Xóa dịch vụ hosting | ✅ |

### Email Services (`/api/services/email`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ email | ✅ |
| POST | `/` | Tạo dịch vụ email mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ email | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ email | ✅ |
| DELETE | `/:id` | Xóa dịch vụ email | ✅ |

### SSL Services (`/api/services/ssl`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ SSL | ✅ |
| POST | `/` | Tạo dịch vụ SSL mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ SSL | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ SSL | ✅ |
| DELETE | `/:id` | Xóa dịch vụ SSL | ✅ |

### Website Services (`/api/services/website`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ website | ✅ |
| POST | `/` | Tạo dịch vụ website mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ website | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ website | ✅ |
| DELETE | `/:id` | Xóa dịch vụ website | ✅ |

### Content Services (`/api/services/content`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ content | ✅ |
| POST | `/` | Tạo dịch vụ content mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ content | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ content | ✅ |
| DELETE | `/:id` | Xóa dịch vụ content | ✅ |

### Toplist Services (`/api/services/toplist`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ toplist | ✅ |
| POST | `/` | Tạo dịch vụ toplist mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ toplist | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ toplist | ✅ |
| DELETE | `/:id` | Xóa dịch vụ toplist | ✅ |

### Maintenance Services (`/api/services/maintenance`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ bảo trì | ✅ |
| POST | `/` | Tạo dịch vụ bảo trì mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ bảo trì | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ bảo trì | ✅ |
| DELETE | `/:id` | Xóa dịch vụ bảo trì | ✅ |

### Mobile Network Services (`/api/services/mobile-network`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ mạng di động | ✅ |
| POST | `/` | Tạo dịch vụ mạng di động mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ mạng di động | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ mạng di động | ✅ |
| DELETE | `/:id` | Xóa dịch vụ mạng di động | ✅ |

## ITVT Service APIs

### ITVT Domain (`/api/itvt/domain`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ ITVT domain | ✅ |
| POST | `/` | Tạo dịch vụ ITVT domain mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ ITVT domain | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ ITVT domain | ✅ |
| DELETE | `/:id` | Xóa dịch vụ ITVT domain | ✅ |

### ITVT Hosting (`/api/itvt/hosting`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ ITVT hosting | ✅ |
| POST | `/` | Tạo dịch vụ ITVT hosting mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ ITVT hosting | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ ITVT hosting | ✅ |
| DELETE | `/:id` | Xóa dịch vụ ITVT hosting | ✅ |

### ITVT SSL (`/api/itvt/ssl`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ ITVT SSL | ✅ |
| POST | `/` | Tạo dịch vụ ITVT SSL mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ ITVT SSL | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ ITVT SSL | ✅ |
| DELETE | `/:id` | Xóa dịch vụ ITVT SSL | ✅ |

### ITVT Email (`/api/itvt/email`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách dịch vụ ITVT email | ✅ |
| POST | `/` | Tạo dịch vụ ITVT email mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết dịch vụ ITVT email | ✅ |
| PUT | `/:id` | Cập nhật dịch vụ ITVT email | ✅ |
| DELETE | `/:id` | Xóa dịch vụ ITVT email | ✅ |

## Supplier APIs

### Supplier Service (`/api/supplier/service`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách nhà cung cấp dịch vụ | ✅ |
| POST | `/` | Tạo nhà cung cấp dịch vụ mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết nhà cung cấp dịch vụ | ✅ |
| PUT | `/:id` | Cập nhật nhà cung cấp dịch vụ | ✅ |
| DELETE | `/:id` | Xóa nhà cung cấp dịch vụ | ✅ |

### Supplier Network (`/api/supplier/network`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách nhà cung cấp mạng | ✅ |
| POST | `/` | Tạo nhà cung cấp mạng mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết nhà cung cấp mạng | ✅ |
| PUT | `/:id` | Cập nhật nhà cung cấp mạng | ✅ |
| DELETE | `/:id` | Xóa nhà cung cấp mạng | ✅ |

### Supplier Server (`/api/supplier/server`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách nhà cung cấp server | ✅ |
| POST | `/` | Tạo nhà cung cấp server mới | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết nhà cung cấp server | ✅ |
| PUT | `/:id` | Cập nhật nhà cung cấp server | ✅ |
| DELETE | `/:id` | Xóa nhà cung cấp server | ✅ |

## Statistics APIs (`/api/statistics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/expense-report` | Lấy báo cáo chi phí dịch vụ | ✅ |

## System Management APIs

### Action Logs (`/api/action-logs`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy lịch sử thao tác | ✅ |

### IP Whitelist (`/api/ip-whitelist`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách IP whitelist | ✅ |
| POST | `/` | Thêm IP vào whitelist | ✅ |
| GET | `/:id` | Lấy thông tin chi tiết IP | ✅ |
| PUT | `/:id` | Cập nhật IP whitelist | ✅ |
| DELETE | `/:id` | Xóa IP khỏi whitelist | ✅ |

### IP Validation (`/api/valid`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Kiểm tra IP có trong whitelist | ❌ |

### Backups (`/api/backups`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Lấy danh sách backup | ✅ |
| GET | `/backups` | Lấy thông tin backup | ✅ |
| GET | `/download/:id` | Tải xuống backup | ✅ |

## Authentication & Authorization

### JWT Token
- Tất cả API được bảo vệ (trừ auth và validation) đều yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

### Role-based Access Control
- Mỗi endpoint có role ID cụ thể để kiểm tra quyền truy cập
- Role được kiểm tra thông qua middleware `check_role`

## Error Handling

### Common Error Responses
```json
{
  "message": "Error message",
  "error": "Error details"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## File Upload
- Một số API hỗ trợ upload file (khách hàng, dịch vụ)
- Sử dụng `multipart/form-data`
- File được lưu trong thư mục `uploads/`

## Cron Jobs
- Hệ thống có cron job chạy hàng ngày lúc 00:00 để:
  - Cập nhật trạng thái dịch vụ
  - Gửi thông báo email nếu có dịch vụ cần chú ý
