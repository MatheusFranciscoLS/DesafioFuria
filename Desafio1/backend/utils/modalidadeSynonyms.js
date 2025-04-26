// Centralização dos sinônimos de modalidades
const modalidadeMap = {
  'cs2': ['cs2', 'csgo', 'cs:go', 'counter strike', 'counter-strike', 'cs'],
  'valorant': ['valorant'],
  'rainbowsix': ['rainbowsix', 'rainbow six', 'rainbow six siege', 'rs6', 'r6'],
  'fifa': ['fifa', 'futebol'],
  'kingsleague': ['kingsleague', 'kings league'],
  'apex': ['apex', 'apex legends'],
  'lol': ['lol', 'league of legends', 'league', 'l.o.l.'],
  'rocketleague': ['rocketleague', 'rocket league', 'rocket', 'rl']
};

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
