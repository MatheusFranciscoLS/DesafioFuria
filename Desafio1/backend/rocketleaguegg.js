// rocketleaguegg.js - Scraping Rocket League Esports site para jogos da FURIA
const axios = require('axios');
const cheerio = require('cheerio');

const RL_TEAM_URL = 'https://esports.rocketleague.com/teams/107/furia-esports/';

async function getFuriaRocketLeagueStatus() {
  try {
    const resp = await axios.get(RL_TEAM_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      }
    });
    const $ = cheerio.load(resp.data);
    // Buscar próxima partida na seção "Upcoming Matches"
    let matchRow = $('.team-upcoming-matches .match').first();
    let status = 'Agendado';
    if (!matchRow.length) {
      matchRow = $('.team-live-matches .match').first();
      status = 'Em andamento';
    }
    if (!matchRow.length) {
      return null;
    }
    const teams = matchRow.find('.team-name').map((i, el) => $(el).text().trim()).get();
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
    console.error('[RocketLeagueGG] Erro ao buscar status Rocket League:', err.message);
    return null;
  }
}

module.exports = { getFuriaRocketLeagueStatus };
