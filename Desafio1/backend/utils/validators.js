const Joi = require('joi');

const validateModalidade = (value) => {
  const schema = Joi.string().min(2).required();
  return schema.validate(value);
};

module.exports = { validateModalidade };
