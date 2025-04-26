const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // Limite de 100 requisições por minuto por IP
  message: { erro: 'Limite de requisições excedido. Tente novamente em instantes.' }
});

module.exports = limiter;
