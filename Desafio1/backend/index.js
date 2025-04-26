const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = 5000;

// Firebase Admin SDK init
try {
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});
  console.log('Firebase Admin inicializado!');
} catch (e) {
  console.warn('Firebase Admin já inicializado ou erro:', e.message);
}


// Middleware CORS manual para garantir compatibilidade total
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Log detalhado de requisições
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});


// Mock endpoint para status de jogos
app.get('/api/live-status', (req, res) => {
  res.json({
    match: 'FURIA vs NAVI',
    status: 'Em andamento',
    score: '8-6',
    round: 15,
    time: '10:45',
    map: 'Mirage'
  });
});

app.get('/', (req, res) => {
  res.send('Backend FURIA Fan Chat rodando!');
});

// Modular routes
app.use('/api/elenco', require('./routes/elenco'));
app.use('/api/jogos', require('./routes/jogos'));
app.use('/api/placares', require('./routes/placares'));
app.use('/api/estatisticas', require('./routes/estatisticas'));
app.use('/api/curiosidades', require('./routes/curiosidades'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/modalidades', require('./routes/modalidades'));


// 404 handler para rotas não encontradas
app.use((req, res, next) => {
  res.status(404).json({ erro: 'Endpoint não encontrado' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error('Erro global:', err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor', detalhes: err.message });
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});

