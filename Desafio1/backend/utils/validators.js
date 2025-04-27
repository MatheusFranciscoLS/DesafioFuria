const Joi = require('joi');

/**
 * Valida se o valor informado é uma modalidade válida (mínimo 2 caracteres, obrigatório)
 * @param {string} value
 * @returns {object} Resultado da validação Joi
 */
const validateModalidade = (value) => {
  const schema = Joi.string().min(2).required();
  return schema.validate(value);
};

module.exports = { validateModalidade };
