import Joi from "joi";

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(4).max(50).alphanum().trim().required().messages({
    "string.base": "username must be a type of string",
    "string.empty": "username cannot be an empty field",
    "string.min": "username must have a minimum length of {#limit}",
    "string.max": "username must have a maximum length of {#limit}",
    "string.alphanum": "username can only contain alphanumeric characters",
  }),
  password: Joi.string().min(8).required().messages({
    "string.base": "password must be a type of string",
    "string.empty": "password cannot be an empty field",
    "string.min": "password must be at least {#limit} characters",
  }),
  fullname: Joi.string().required().messages({
    "string.base": "fullname must be a type of string",
    "string.empty": "fullname cannot be an empty field",
  }),
});

export { UserPayloadSchema };
