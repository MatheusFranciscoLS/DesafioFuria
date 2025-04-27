// siegegg.js - Scraping de jogos da FURIA no Rainbow Six pelo siege.gg
const axios = require('axios');
const cheerio = require('cheerio');

const SIEGEGG_TEAM_URL = 'https://siege.gg/teams/404-furia';

async function getFuriaRainbowSixStatusSiegeGG() {
  try {
    const resp = await axios.get(SIEGEGG_TEAM_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      }
    });
    const $ = cheerio.load(resp.data);
    // Pega o próximo jogo da FURIA na seção "Upcoming Matches"
    // Tentar buscar partida em andamento ou próxima
    let matchRow = $('.upcoming-matches .match').first();
    let status = 'Agendado';
    if (!matchRow.length) {
      // Tentar buscar partida em andamento
      matchRow = $('.ongoing-matches .match').first();
      status = 'Em andamento';
    }
    if (!matchRow.length) {
      // Se não achar nada, logar trecho do HTML para debug
      console.warn('[SiegeGG] Nenhuma partida encontrada em upcoming nem ongoing matches.');
      return null;
    }
    // Extrai dados do HTML
    const teams = matchRow.find('.team').map((i, el) => $(el).text().trim()).get();
    const event = matchRow.find('.event-name').text().trim() || '-';
    const date = matchRow.find('.date').text().trim() || '';
    const time = matchRow.find('.time').text().trim() || '';
    return {
      match: teams.join(' vs '),
      status,
      score: '-',
      round: null,
      time: time,
      map: '-',
      event: event,
      date: date
    };

  } catch (err) {
    console.error('[SiegeGG] Erro ao buscar status Rainbow Six:', err.message);
    return {
      match: 'FURIA',
      status: 'Erro ao buscar status Rainbow Six (siege.gg)',
      score: '-',
      round: null,
      time: '',
      map: '-',
      event: '-',
      date: ''
    };
  }
}

module.exports = { getFuriaRainbowSixStatusSiegeGG };
