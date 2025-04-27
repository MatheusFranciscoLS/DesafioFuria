// fifagg.js - Scraping da Liquipedia FIFA para jogos da FURIA
const axios = require('axios');
const cheerio = require('cheerio');

const FIFA_URL = 'https://liquipedia.net/fifa/FURIA';

async function getFuriaFifaStatus() {
  try {
    const resp = await axios.get(FIFA_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      }
    });
    const $ = cheerio.load(resp.data);
    // Buscar próxima partida na tabela de jogos
    let matchRow = $('.infobox-cell-2 .match-info, .infobox-cell-2 .brkts-match-info').first();
    let status = 'Agendado';
    if (!matchRow.length) {
      return null;
    }
    const teams = matchRow.find('.team-left, .team-right').map((i, el) => $(el).text().trim()).get();
    const date = matchRow.find('.timer-object').attr('data-timestamp') || '';
    const event = matchRow.find('.match-filler').text().trim() || '-';
    return {
      match: teams.join(' vs '),
      status,
      score: '-',
      round: null,
      time: date ? new Date(Number(date) * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
      map: '-',
      event: event,
      date: date ? new Date(Number(date) * 1000).toLocaleDateString('pt-BR') : ''
    };
  } catch (err) {
    console.error('[FifaGG] Erro ao buscar status FIFA:', err.message);
    return null;
  }
}

module.exports = { getFuriaFifaStatus };
