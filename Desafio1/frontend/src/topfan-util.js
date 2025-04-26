// Retorna o nome do usuário Top 1 a partir do array de mensagens
export function getTopFan(messages) {
  if (!messages || !messages.length) return null;
  const counts = {};
  messages.forEach(m => {
    const nome = m.user || m.displayName || 'Anônimo';
    counts[nome] = (counts[nome] || 0) + 1;
  });
  const ranking = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return ranking.length ? ranking[0][0] : null;
}
