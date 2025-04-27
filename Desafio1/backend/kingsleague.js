// kingsleague.js - Busca dados reais de jogos da FURIA Kings League via scraping
const axios = require('axios');
const cheerio = require('cheerio');

const KINGS_URL = 'https://kingsleague.pro/pt/times/50-furia-fc';

async function getFuriaKingsLeagueStatus() {
  const resp = await axios.get(KINGS_URL);
  const html = resp.data;
  const $ = cheerio.load(html);

  // Procura por tabela de jogos
  const matches = [];
  $('.matches-table tbody tr').each((i, el) => {
    const cols = $(el).find('td');
    const date = $(cols[0]).text().trim();
    const time = $(cols[1]).text().trim();
    const opponent = $(cols[2]).text().trim();
    const result = $(cols[3]).text().trim();
    const status = result ? (result.includes('-') ? 'Finalizado' : 'Agendado') : 'Agendado';
    matches.push({
      match: `FURIA FC vs ${opponent}`,
      date,
      time,
      status,
      score: result || '-',
      round: null,
      map: '-',
      event: 'Kings League',
    });
  });
  if (matches.length > 0) {
    // Retorna o próximo jogo não finalizado, senão o último
    const next = matches.find(m => m.status !== 'Finalizado') || matches[0];
    return next;
  }
  return null;
}

module.exports = { getFuriaKingsLeagueStatus };
