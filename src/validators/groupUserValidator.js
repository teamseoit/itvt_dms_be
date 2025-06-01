const Joi = require('joi');

const createGroupUserSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'any.required': 'Tên nhóm người dùng là bắt buộc.',
    'string.empty': 'Tên nhóm người dùng không được để trống.',
  })
});

const updateGroupUserSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'any.required': 'Tên nhóm người dùng là bắt buộc.',
    'string.empty': 'Tên nhóm người dùng không được để trống.',
  })
});

module.exports = {
  createGroupUserSchema,
  updateGroupUserSchema,
};
