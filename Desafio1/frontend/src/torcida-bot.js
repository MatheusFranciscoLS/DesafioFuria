// Bot de Torcida FURIA - responde comandos e frases prontas

export const BOT_NAME = 'Torcida FURIA';
export const BOT_PHOTO = '/furia-bot.png'; // Coloque um mascote ou logo pequeno

const frasesProntas = [
  'Aqui é FURIA! 🔥',
  'VAMO, VAMO!',
  'É clutch ou é FURIA!',
  'Salve pro arT!',
  'KSCERATO monstro!',
];

export function getFrasesProntas() {
  return frasesProntas;
}

export function botResponder(msg) {
  const texto = msg.text.trim().toLowerCase();
  // Comandos e perguntas frequentes
  if (texto.startsWith('/grito')) {
    return 'AAAAAAQUI É FUUUUURIAAAAA! 🔥🦁';
  }
  if (texto.startsWith('/salve')) {
    return 'Salve, salve! A torcida tá on!';
  }
  if (texto.startsWith('/meme')) {
    return 'Manda aquele meme da FURIA! 😎';
  }
  if (texto.startsWith('/help') || texto.startsWith('/ajuda')) {
    return 'Você está no canal de ajuda! Pergunte sobre a FURIA, ranking, jogadores, próximos jogos, ou use comandos: /grito, /salve, /meme, /info, /estatisticas, /mvp.';
  }
  if (texto.startsWith('/info')) {
    return 'FURIA Esports: Org brasileira de CS:GO, paixão e garra nos Esportes!';
  }
  if (texto.startsWith('/estatisticas')) {
    return 'Estatísticas: arT (IGL), KSCERATO (clutch master), yuurih (entry), chelo (support), saffee (AWPer).';
  }
  if (texto.includes('próximo jogo') || texto.includes('proximo jogo')) {
    return 'O próximo jogo da FURIA será anunciado em nossas redes sociais! Fique ligado no Twitter oficial.';
  }
  if (texto.includes('quem é art') || texto.includes('quem e art')) {
    return 'arT é o capitão e IGL da FURIA, conhecido por seu estilo agressivo!';
  }
  if (texto.includes('ranking')) {
    return 'O ranking de fãs é baseado na quantidade de mensagens enviadas no chat. Participe para subir no ranking!';
  }
  if (texto.includes('sorteio') || texto.includes('participar de sorteio')) {
    return 'Sorteios são anunciados durante transmissões ao vivo. Fique atento ao canal #geral e às redes oficiais!';
  }
  // Frases rápidas
  if (frasesProntas.some(f => texto === f.toLowerCase())) {
    return frasesProntas.find(f => texto === f.toLowerCase());
  }
  // Enquete exemplo
  if (texto.startsWith('/mvp')) {
    return 'Vote no MVP do round: arT, KSCERATO, yuurih, chelo, saffee.';
  }
  // Resposta padrão
  if (texto.length > 3) {
    return 'Desculpe, não entendi sua dúvida. Tente perguntar de outro jeito ou use /help para ver os comandos.';
  }
  return null;
}
