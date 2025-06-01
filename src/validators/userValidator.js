const Joi = require('joi');

const addUserSchema = Joi.object({
  display_name: Joi.string().allow('', null),
  username: Joi.string().min(4).max(30).required().messages({
    'string.empty': 'Tên đăng nhập không được để trống!',
    'string.min': 'Tên đăng nhập phải có ít nhất {#limit} ký tự!',
    'any.required': 'Tên đăng nhập là bắt buộc!',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email không hợp lệ! Vui lòng nhập đúng định dạng!',
    'any.required': 'Email là bắt buộc!',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Mật khẩu không được để trống!',
    'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự!',
    'any.required': 'Mật khẩu là bắt buộc!',
  }),
  group_user_id: Joi.string().optional(),
});

module.exports = {
  addUserSchema
};
