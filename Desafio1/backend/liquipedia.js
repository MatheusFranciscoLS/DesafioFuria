// liquipedia.js - Busca dados reais de partidas da FURIA em diversas modalidades via Liquipedia (scraping)
const axios = require('axios');
const cheerio = require('cheerio');

// Mapeamento de URLs da Liquipedia para cada modalidade
const MODALIDADE_URLS = {
  cs2: 'https://liquipedia.net/counterstrike/FURIA_Esports',
  csgo: 'https://liquipedia.net/counterstrike/FURIA_Esports',
  cs: 'https://liquipedia.net/counterstrike/FURIA_Esports',
  valorant: 'https://liquipedia.net/valorant/FURIA',
  lol: 'https://liquipedia.net/leagueoflegends/FURIA',
  rainbowsix: 'https://liquipedia.net/rainbowsix/FURIA',
  rocketleague: 'https://liquipedia.net/rocketleague/FURIA',
  apex: 'https://liquipedia.net/apexlegends/FURIA',
  fifa: 'https://liquipedia.net/fifa/FURIA',
};

// Busca o próximo jogo ou jogo ao vivo da FURIA na modalidade
async function getFuriaLiveStatusLiquipedia(modalidade = 'valorant') {
  const url = MODALIDADE_URLS[modalidade];
  if (!url) {
    console.warn(`[Liquipedia] Modalidade não suportada: ${modalidade}`);
    return {
      match: 'FURIA',
      status: 'Modalidade não suportada',
      score: '-',
      round: null,
      time: '',
      map: '-',
      event: '-',
      date: ''
    };
  }
  try {
    console.log(`[Liquipedia] Buscando próxima partida da FURIA em: ${url}`);
    const resp = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
      }
    });
    const html = resp.data;
    const $ = cheerio.load(html);

    // Procura por tabela de jogos futuros/ao vivo
    const matches = [];
    $('.infobox-cell-2 .match-info, .infobox-cell-2 .brkts-match-info').each((i, el) => {
      const teams = $(el).find('.team-left, .team-right').map((_, t) => $(t).text().trim()).get();
      const date = $(el).find('.timer-object').attr('data-timestamp') || '';
      const event = $(el).find('.match-filler').text().trim() || '';
      matches.push({
        match: teams.join(' vs '),
        date,
        event,
        status: 'Agendado',
        score: '-',
        round: null,
        time: date ? new Date(Number(date) * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
        map: '-',
      });
    });

    if (matches.length > 0) {
      console.log(`[Liquipedia] Próxima partida encontrada:`, matches[0]);
      return matches[0];
    }
    console.log('[Liquipedia] Nenhuma partida futura encontrada no HTML.');
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
  } catch (err) {
    console.error(`[Liquipedia] Erro ao buscar ou processar página:`, err.message);
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

module.exports = { getFuriaLiveStatusLiquipedia };
