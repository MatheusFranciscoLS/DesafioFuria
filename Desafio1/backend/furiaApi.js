// API mock para dados dinâmicos da FURIA
// Substitua por integração real se desejar
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Mock: elenco por modalidade
const elencos = {
  'csgo': ['arT', 'yuurih', 'KSCERATO', 'chelo', 'saffee'],
  'valorant': ['qck', 'mwzera', 'nzr', 'xand', 'fznnn'],
  'lol': ['FNB', 'Croc', 'Envy', 'Trigo', 'RedBert'],
  'rocketleague': ['CaioTG1', 'Card', 'Lostt'],
};

// Mock: próximos jogos
const jogos = [
  { modalidade: 'csgo', adversario: 'MIBR', data: '2025-04-28', hora: '18:00', torneio: 'CBLOL' },
  { modalidade: 'valorant', adversario: 'LOUD', data: '2025-04-29', hora: '20:00', torneio: 'VCT Americas' },
];

// Mock: placar
const placares = [
  { modalidade: 'csgo', resultado: 'FURIA 2 x 1 Imperial', data: '2025-04-20' },
  { modalidade: 'lol', resultado: 'FURIA 0 x 2 paiN', data: '2025-04-19' },
];

app.get('/api/elenco/:modalidade', (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  res.json({ elenco: elencos[mod] || [] });
});

app.get('/api/jogos', (req, res) => {
  res.json({ jogos });
});

app.get('/api/placares', (req, res) => {
  res.json({ placares });
});

// Mock: estatísticas por jogador
const estatisticas = {
  'art': { kills: 120, deaths: 90, kdr: 1.33, time: 'CS:GO', curiosidade: 'Conhecido pelo estilo agressivo.' },
  'yuurih': { kills: 150, deaths: 80, kdr: 1.87, time: 'CS:GO', curiosidade: 'MVP em vários campeonatos.' },
  'qck': { kills: 95, deaths: 70, kdr: 1.36, time: 'Valorant', curiosidade: 'Jogador mais jovem do elenco.' },
};

app.get('/api/estatisticas/:jogador', (req, res) => {
  const nick = req.params.jogador.toLowerCase();
  res.json(estatisticas[nick] || {});
});

// Mock: curiosidades por modalidade
const curiosidades = {
  'csgo': ['Primeira equipe brasileira a chegar ao top 3 do ranking HLTV em 2020.', 'FURIA é famosa pelo estilo agressivo.'],
  'valorant': ['FURIA foi a primeira equipe brasileira a vencer um time europeu no VCT.'],
  'lol': ['A FURIA já disputou semifinais do CBLOL.'],
};

app.get('/api/curiosidades/:modalidade', (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  res.json({ curiosidades: curiosidades[mod] || [] });
});

// Mock: notícias recentes
const noticias = [
  { titulo: 'FURIA vence clássico contra MIBR', data: '2025-04-25', link: '#' },
  { titulo: 'Novo reforço anunciado para o Valorant', data: '2025-04-24', link: '#' },
  { titulo: 'FURIA lança coleção de uniformes 2025', data: '2025-04-22', link: '#' },
];

app.get('/api/noticias', (req, res) => {
  res.json({ noticias });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FURIA API rodando na porta ${PORT}`);
});
