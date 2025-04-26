// Utilitários para #bot-ajuda: histórico local, filtro, tópicos populares, tooltips
export function saveUserFaqHistory(userId, question) {
  if (!userId) return;
  let hist = JSON.parse(localStorage.getItem('faqHistory_' + userId) || '[]');
  hist.unshift({ q: question, ts: Date.now() });
  hist = hist.slice(0, 10);
  localStorage.setItem('faqHistory_' + userId, JSON.stringify(hist));
}
export function getUserFaqHistory(userId) {
  if (!userId) return [];
  return JSON.parse(localStorage.getItem('faqHistory_' + userId) || '[]');
}
export function filterFaqSuggestions(suggestions, query) {
  if (!query) return suggestions;
  return suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
}
export function getPopularFaqTopics() {
  // Simulação: tópicos mais usados (poderia vir do backend futuramente)
  return [
    'Quando é o próximo jogo?',
    'Como funciona o ranking?',
    'Quem é o arT?',
    'Quais comandos posso usar?'
  ];
}
export function getFaqTooltip(suggestion) {
  // Tooltips customizados para sugestões
  const tooltips = {
    'Quando é o próximo jogo?': 'Veja a data e horário do próximo confronto da FURIA.',
    'Qual o placar do último jogo?': 'Confira o resultado mais recente da equipe.',
    'Quem é o arT?': 'Descubra curiosidades sobre o IGL da FURIA.',
    'Como funciona o ranking?': 'Entenda como os pontos são calculados.',
    'Quais comandos posso usar?': 'Veja todos os comandos disponíveis no chat.',
    'Me fale uma curiosidade da FURIA': 'Receba uma curiosidade aleatória do bot.',
    'Quais são as regras do chat?': 'Saiba o que é permitido e proibido.',
    'Como participar do sorteio?': 'Veja como concorrer a prêmios.',
    // ...adicione mais conforme necessário
  };
  return tooltips[suggestion] || 'Clique para copiar esta sugestão.';
}
