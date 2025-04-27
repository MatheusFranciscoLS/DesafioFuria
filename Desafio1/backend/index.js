/**
 * index.js - Backend principal da API FURIA GG
 * Inicializa servidor Express, integra Firebase, middlewares, rotas e documentação Swagger.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = 3031;

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

// Rate limiting global
const rateLimiter = require('./middleware/rateLimiter');
app.use('/api/', rateLimiter);

// Documentação Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas principais da API
app.use('/api/curiosidades', require('./routes/curiosidades'));
app.use('/api/elenco', require('./routes/elenco'));
app.use('/api/estatisticas', require('./routes/estatisticas'));
app.use('/api/jogos', require('./routes/jogos'));
app.use('/api/modalidades', require('./routes/modalidades'));
app.use('/api/noticias', require('./routes/noticias'));
app.use('/api/placares', require('./routes/placares'));

// Log detalhado de requisições
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});


// Endpoint para status de jogos por modalidade
const { getFuriaLiveStatusLiquipedia } = require('./liquipedia');
const { getFuriaLiveStatus } = require('./hltv');
const { getFuriaKingsLeagueStatus } = require('./kingsleague');
const { getFuriaLiveStatusPandascore } = require('./pandascore');
const { getFuriaRainbowSixStatusSiegeGG } = require('./siegegg');
const { getFuriaRocketLeagueStatus } = require('./rocketleaguegg');
const { getFuriaApexStatus } = require('./apexgg');
const { getFuriaFifaStatus } = require('./fifagg');

app.get('/api/live-status', async (req, res) => {
  const modalidade = (req.query.modalidade || '').toLowerCase();
  const pandascoreToken = req.query.token || process.env.PANDASCORE_TOKEN;
  try {
    // CS2, Valorant e LoL via Pandascore
    if (["cs2", "valorant", "lol"].includes(modalidade)) {
      try {
        const statusPanda = await getFuriaLiveStatusPandascore(modalidade, pandascoreToken);
        if (statusPanda && statusPanda.match && statusPanda.status) return res.status(200).json(statusPanda);
      } catch (err) {
        console.error('[API] Erro ao buscar status Pandascore:', err.message);
      }
    }
    // Demais modalidades: buscar no mock_games.json
    try {
      const fs = require('fs');
      const mockGames = JSON.parse(fs.readFileSync(__dirname + '/mock_games.json', 'utf-8'));
      const mock = mockGames.find(g => g.modalidade === modalidade);
      if (mock) {
        console.log(`[API] ${modalidade}: dado mock usado:`, mock);
        return res.status(200).json(mock);
      }
    } catch (err) {
      console.error(`[API] Erro ao ler mock_games.json para ${modalidade}:`, err.message);
    }
    // Fallback para resposta padrão
    return res.status(200).json({
      match: 'FURIA',
      status: 'Sem partidas futuras ou erro ao buscar status',
      score: '-',
      round: null,
      time: '',
      map: '-',
      event: '-',
      date: ''
    });
  } catch (e) {
    console.error('[API] Erro inesperado no endpoint /api/live-status:', e.message);
    res.status(200).json({
      match: 'FURIA',
      status: 'Erro inesperado ao buscar status ao vivo',
      score: '-',
      round: null,
      time: '',
      map: '-',
      event: '-',
      date: ''
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
