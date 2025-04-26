const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
