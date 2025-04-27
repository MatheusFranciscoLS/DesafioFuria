/**
 * ===============================
 * Backend Mock FURIA - API REST
 * ===============================
 * Simula endpoints de dados da FURIA para testes e desenvolvimento frontend.
 * Pronto para futura integração com APIs reais.
 */

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


// --- MOCKS PRINCIPAIS ---

/**
 * Elenco de jogadores por modalidade
 * @type {Object.<string, string[]>}
 */
const elencos = {
  'cs2': ['arT', 'yuurih', 'KSCERATO', 'chelo', 'saffee'],
  'valorant': ['Mazin', 'QCK', 'Khalil', 'mwzera', 'Quick'],
  'lol': ['FNB', 'Croc', 'Envy', 'Trigo', 'RedBert'],
  'rocketleague': ['CaioTG1', 'Card', 'Lostt'],
  'rainbowsix': ['R4re', 'Handyy', 'Miracle', 'Fntzy', 'Lenda'],
  'apex': ['HisWattson', 'Zer0', 'Pandxrz'],
  'pubg': ['Kickstart', 'Roth', 'Snakers', 'Shrimzy'],
  'futebol7': ['Jogador F7-1', 'Jogador F7-2', 'Jogador F7-3', 'Jogador F7-4', 'Jogador F7-5']
};

/**
 * Lista de próximos jogos
 * @type {Array<{modalidade: string, adversario: string, data: string, hora: string, torneio: string}>}
 */
const jogos = [
  { modalidade: 'cs2', adversario: 'NAVI', data: '2025-05-01', hora: '18:00', torneio: 'Major' },
  { modalidade: 'valorant', adversario: 'LOUD', data: '2025-05-02', hora: '20:00', torneio: 'Champions' },
  { modalidade: 'rainbowsix', adversario: 'Liquid', data: '2025-05-03', hora: '17:00', torneio: 'Brasileirão R6' },
  { modalidade: 'apex', adversario: 'LOUD', data: '2025-05-06', hora: '20:00', torneio: 'ALGS' },
  { modalidade: 'lol', adversario: 'paiN', data: '2025-05-07', hora: '16:00', torneio: 'CBLOL' },
  { modalidade: 'rocketleague', adversario: 'Team BDS', data: '2025-05-08', hora: '15:00', torneio: 'RLCS' },
  { modalidade: 'pubg', adversario: 'FaZe Clan', data: '2025-05-09', hora: '14:00', torneio: 'PGS' },
  { modalidade: 'futebol7', adversario: 'Corinthians', data: '2025-05-10', hora: '19:00', torneio: 'Copa Fut7' }
];

/**
 * Placar dos jogos recentes
 * @type {Array<{modalidade: string, resultado: string, data: string}>}
 */
const placares = [
  { modalidade: 'cs2', resultado: 'FURIA 2 x 1 Imperial', data: '2025-04-20' },
  { modalidade: 'valorant', resultado: 'FURIA 13x11 LOUD', data: '2025-04-19' },
  { modalidade: 'rainbowsix', resultado: 'FURIA 7x5 Liquid', data: '2025-04-18' },
  { modalidade: 'apex', resultado: 'FURIA Top 2', data: '2025-04-15' },
  { modalidade: 'lol', resultado: 'FURIA 2x0 paiN', data: '2025-04-14' },
  { modalidade: 'rocketleague', resultado: 'FURIA 3x2 Team BDS', data: '2025-04-13' },
  { modalidade: 'pubg', resultado: 'FURIA 1º Lugar PGS', data: '2025-04-12' },
  { modalidade: 'futebol7', resultado: 'FURIA 5x3 Corinthians', data: '2025-04-11' }
];

// --- ROTAS DE API ---

/**
 * Rota: retorna elenco de jogadores por modalidade
 * @route GET /api/elenco/:modalidade
 */
app.get('/api/elenco/:modalidade', (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  res.json({ elenco: elencos[mod] || [] });
});

/**
 * Rota: retorna próximos jogos, podendo filtrar por modalidade
 * @route GET /api/jogos
 */
app.get('/api/jogos', (req, res) => {
  const modalidade = (req.query.modalidade || '').toLowerCase();
  if (modalidade) {
    const filtered = jogos.filter(j => j.modalidade === modalidade);
    return res.json({ jogos: filtered });
  }
  res.json({ jogos });
});

/**
 * Rota: retorna placares recentes
 * @route GET /api/placares
 */
app.get('/api/placares', (req, res) => {
  res.json({ placares });
});

/**
 * Estatísticas por jogador
 * @type {Object.<string, {kills: number, deaths: number, kdr: number, time: string, curiosidade: string}>}
 */
const estatisticas = {
  'art': { kills: 120, deaths: 90, kdr: 1.33, time: 'CS:GO', curiosidade: 'Conhecido pelo estilo agressivo.' },
  'yuurih': { kills: 150, deaths: 80, kdr: 1.87, time: 'CS:GO', curiosidade: 'MVP em vários campeonatos.' },
  'qck': { kills: 95, deaths: 70, kdr: 1.36, time: 'Valorant', curiosidade: 'Jogador mais jovem do elenco.' },
};

/**
 * Rota: retorna estatísticas de um jogador pelo nickname
 * @route GET /api/estatisticas/:jogador
 */
app.get('/api/estatisticas/:jogador', (req, res) => {
  const nick = req.params.jogador.toLowerCase();
  res.json(estatisticas[nick] || {});
});

/**
 * Curiosidades por modalidade
 * @type {Object.<string, string[]>}
 */
const curiosidades = {
  'csgo': ['Primeira equipe brasileira a chegar ao top 3 do ranking HLTV em 2020.', 'FURIA é famosa pelo estilo agressivo.'],
  'valorant': ['FURIA foi a primeira equipe brasileira a vencer um time europeu no VCT.'],
  'lol': ['A FURIA já disputou semifinais do CBLOL.'],
};

/**
 * Rota: retorna curiosidades por modalidade
 * @route GET /api/curiosidades/:modalidade
 */
app.get('/api/curiosidades/:modalidade', (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  res.json({ curiosidades: curiosidades[mod] || [] });
});

/**
 * Notícias recentes
 * @type {Array<{titulo: string, data: string, link: string}>}
 */
const noticias = [
  { titulo: 'FURIA vence clássico contra MIBR', data: '2025-04-25', link: '#' },
  { titulo: 'Novo reforço anunciado para o Valorant', data: '2025-04-24', link: '#' },
  { titulo: 'FURIA lança coleção de uniformes 2025', data: '2025-04-22', link: '#' },
];

/**
 * Rota: retorna notícias recentes
 * @route GET /api/noticias
 */
app.get('/api/noticias', (req, res) => {
  res.json({ noticias });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3031;
app.listen(PORT, () => {
  console.log(`FURIA API rodando na porta ${PORT}`);
});
