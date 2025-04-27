// hltv.js - Funções utilitárias para buscar dados reais da HLTV API não oficial
const axios = require('axios');
const cheerio = require('cheerio');

async function getFuriaLiveStatus() {
  const url = 'https://www.hltv.org/team/6665/furia';
  try {
    console.log('[HLTV] Buscando próxima partida da FURIA em:', url);
    const resp = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      }
    });
    const html = resp.data;
    const $ = cheerio.load(html);
    // Buscar o próximo jogo (Upcoming matches)
    const matchRow = $('.upcomingMatches .match').first();
    if (!matchRow || matchRow.length === 0) {
      console.log('[HLTV] Nenhuma partida futura encontrada no HTML.');
      return {
        match: 'FURIA',
        status: 'Sem partidas futuras encontradas',
        score: '-',
        round: null,
        time: '',
        map: '-',
        event: '-',
        date: ''
      };
    }
    const teams = matchRow.find('.matchTeamName').map((i, el) => $(el).text().trim()).get();
    const event = matchRow.find('.matchEventName').text().trim();
    const time = matchRow.find('.matchTime').attr('data-unix');
    const date = time ? new Date(parseInt(time)).toLocaleString() : '';
    console.log('[HLTV] Próxima partida encontrada:', teams.join(' vs '), event, date);
    return {
      match: teams.join(' vs '),
      status: 'Próximo jogo',
      score: '-',
      round: null,
      time: date,
      map: '-',
      event: event,
      date: date
    };
  } catch (err) {
    console.error('[HLTV] Erro ao buscar ou processar página:', err.message);
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


module.exports = { getFuriaLiveStatus };
