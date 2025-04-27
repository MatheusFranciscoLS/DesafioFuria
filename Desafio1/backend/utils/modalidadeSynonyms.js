/**
 * Centralização dos sinônimos de modalidades
 * @type {Object.<string, string[]>}
 */
const modalidadeMap = {
  'apex': ['apex', 'apex legends'],
  'cs2': ['cs2', 'csgo', 'cs:go', 'counter strike', 'counter-strike', 'cs'],
  'futebol7': ['futebol7', 'futebol 7', 'fut7', 'seven-a-side', 'football7', 'futebol de 7'],
  'lol': ['lol', 'league of legends', 'league', 'l.o.l.'],
  'pubg': ['pubg', 'playerunknown', 'playerunknown battlegrounds'],
  'rainbowsix': ['rainbowsix', 'rainbow six', 'rainbow six siege', 'rs6', 'r6'],
  'rocketleague': ['rocketleague', 'rocket league', 'rocket', 'rl'],
  'valorant': ['valorant']
};

/**
 * Resolve o nome canônico da modalidade a partir de um sinônimo ou nome alternativo
 * @param {string} query
 * @returns {string|null}
 */
function resolveModalidade(query) {
  if (!query) return null;
  const q = query.toLowerCase().replace(/\s+/g, '');
  for (const [key, synonyms] of Object.entries(modalidadeMap)) {
    if (synonyms.some(s => q === s.replace(/\s+/g, ''))) {
      return key;
    }
  }
  return query.toLowerCase(); // fallback para busca exata
}

module.exports = { modalidadeMap, resolveModalidade };
