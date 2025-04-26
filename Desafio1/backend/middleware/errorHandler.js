// Middleware global de tratamento de erros
function errorHandler(err, req, res, next) {
  console.error('Erro global:', err);
  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor',
    detalhes: err.details || null
  });
}

module.exports = errorHandler;
