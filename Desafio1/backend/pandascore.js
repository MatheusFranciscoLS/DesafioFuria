// pandascore.js - Consulta partidas da FURIA na Pandascore API
defaultToken = 'qJQjObmjcETxjBH0GKX5V4RpDQbIlEsoTIEI5T0OuEZLA8P6rTw';
const axios = require('axios');

const TEAM_IDS = {
  cs2: 6665, // FURIA CS:GO/CS2
  lol: 11355, // FURIA LoL (ajustar se necessário)
  valorant: 11617, // FURIA Valorant (ajustar se necessário)
  // Adicione outros IDs se necessário
};

async function getFuriaLiveStatusPandascore(modalidade = 'cs2', token = defaultToken) {
  let url = '';
  let teamId = TEAM_IDS[modalidade];
  if (!teamId) return null;

  if (modalidade === 'cs2') {
    url = `https://api.pandascore.io/csgo/matches?filter[opponent_id]=${teamId}&sort=begin_at`;
  } else if (modalidade === 'lol') {
    url = `https://api.pandascore.io/lol/matches?filter[opponent_id]=${teamId}&sort=begin_at`;
  } else if (modalidade === 'valorant') {
    url = `https://api.pandascore.io/valorant/matches?filter[opponent_id]=${teamId}&sort=begin_at`;
  } else {
    return null;
  }

  try {
    const resp = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const matches = resp.data;
    if (!matches || matches.length === 0) {
      return {
        match: 'FURIA',
        status: 'Sem partidas futuras',
        score: '-',
        round: null,
        time: '',
        map: '-',
        event: '-',
        date: ''
      };
    }
    // Pega o próximo jogo
    const m = matches[0];
    return {
      match: `${m.opponents?.map(o => o.opponent?.name).join(' vs ')}`,
      status: m.status,
      score: '-',
      round: null,
      time: m.begin_at ? new Date(m.begin_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
      map: '-',
      event: m.league?.name || '-',
      date: m.begin_at ? new Date(m.begin_at).toLocaleDateString('pt-BR') : ''
    };
  } catch (err) {
    console.error('[Pandascore] Erro ao consultar API:', err.message);
    return {
      match: 'FURIA',
      status: 'Erro ao buscar status ao vivo',
      score: '-',
      round: null,
      time: '',
      map: '-',
      event: '-',
      date: ''
    };
  }
}

module.exports = { getFuriaLiveStatusPandascore };
