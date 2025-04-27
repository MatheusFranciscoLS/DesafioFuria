/**
 * Bot de Torcida FURIA - responde comandos e frases prontas
 */

/**
 * Nome do bot oficial
 * @type {string}
 */
export const BOT_NAME = "Torcida FURIA";
/**
 * Caminho para o avatar do bot
 * @type {string}
 */
export const BOT_PHOTO = "/furia-bot.png";

/**
 * Frases rápidas universais do bot
 * @type {string[]}
 */
const frasesProntas = [
  "Aqui é FURIA! 🔥",
  "VAMO, VAMO!",
  "É clutch ou é FURIA!",
  "Paixão e Garra!",
  "Vamos pra cima!",
];

/**
 * Retorna as frases rápidas universais do bot
 * @returns {string[]}
 */
export function getFrasesProntas() {
  return frasesProntas;
}

/**
 * Retorna frases rápidas filtradas por modalidade (futuro)
 * @returns {string[]}
 */
export function getFrasesProntasPorModalidade() {
  // Função mantida síncrona pois só retorna array local

  return frasesProntas;
}

// Novo FAQ dinâmico
/**
 * Lista dinâmica de perguntas e respostas do FAQ
 * @type {{perguntas: string[], resposta: string|function}[]}
 */
const FAQ = [
  {
    perguntas: [
      "live status",
      "ao vivo",
      "status ao vivo",
      "furia está jogando",
      "tem jogo agora",
      "furia está ao vivo",
      "está tendo partida agora",
      "/live",
      "/status",
    ],
    resposta: async () => {
      try {
        const res = await fetch("http://localhost:3031/api/live-status");
        if (!res.ok) return "Não consegui acessar o status ao vivo agora.";
        const status = await res.json();
        if (!status || !status.match)
          return "Nenhuma partida ao vivo no momento.";
        return `Live Status: ${status.match}\nStatus: ${
          status.status
        }\nPlacar: ${status.score} | Round: ${status.round} | Mapa: ${
          status.map || "-"
        }${status.time ? `\nHorário: ${status.time}` : ""}`;
      } catch {
        return "Erro ao buscar o status ao vivo.";
      }
    },
  },
  {
    perguntas: [
      "quando é o próximo jogo",
      "próximo jogo",
      "quando a furia joga",
      "data do jogo",
      "horário do jogo",
    ],
    resposta:
      "Confira a agenda dos próximos jogos clicando no botão 'Agenda de Jogos' na barra lateral!",
  },
  {
    perguntas: [
      "como funciona o ranking",
      "ranking de fãs",
      "como subir no ranking",
    ],
    resposta:
      "O ranking é baseado na sua participação no chat! Quanto mais você interage, mais sobe no ranking dos fãs.",
  },
  {
    perguntas: [
      "placares",
      "resultados",
      "resultado do jogo",
      "placar do jogo",
      "resultado recente",
      "últimos resultados",
    ],
    resposta:
      "Confira os placares recentes clicando no botão 'Placares Recentes' na barra lateral!",
  },
  {
    perguntas: [
      "quem é o arT",
      "art",
      "quem é o kscerato",
      "quem é o yuurih",
      "quem é o chelo",
      "quem é o fallen",
      "quem é o guerri",
      "quem é o drop",
      "quem é o furia bot",
    ],
    // nomeUser removido pois não é usado
    resposta: (texto) => {
      const jogadores = {
        art: "arT é o capitão (IGL) do time de CS:GO da FURIA, famoso por seu estilo agressivo!",
        kscerato:
          "KSCERATO é um dos melhores jogadores do Brasil, destaque em clutchs e mira afiada!",
        yuurih:
          "yuurih é referência em consistência e joga pela FURIA desde 2017!",
        chelo:
          "chelo é conhecido pelo seu jogo explosivo e entrou na FURIA em 2023!",
        fallen:
          "FalleN é o Professor, lenda do CS:GO, AWPer e líder tático da FURIA!",
        guerri:
          "guerri é o coach da FURIA, responsável pela estratégia e motivação do time!",
        drop: "drop é jovem talento da FURIA, versátil e muito dedicado!",
        "furia bot":
          "Eu sou o Torcida FURIA Bot, seu assistente oficial no chat!",
      };
      const key = Object.keys(jogadores).find((j) => texto.includes(j));
      return key
        ? jogadores[key]
        : "Esse jogador não está no nosso elenco principal no momento!";
    },
  },
  {
    perguntas: ["ajuda", "comandos", "/help", "/comandos"],
    resposta:
      "Comandos disponíveis: /elenco [modalidade], /estatisticas [nick], /help. Pergunte sobre jogadores ou curiosidades também!",
  },
  {
    perguntas: ["promoção", "sorteio"],
    resposta:
      "Sorteios e promoções são anunciados durante as transmissões e nas redes sociais oficiais da FURIA.",
  },
];

/**
 * Busca resposta no FAQ dinâmico baseado no texto e usuário
 * @param {string} texto
 * @param {string} nomeUser
 */
// Parâmetro nomeUser removido pois não é utilizado
// Parâmetro nomeUser removido pois não é utilizado
/**
 * Busca resposta no FAQ dinâmico baseado no texto
 * @param {string} texto
 * @returns {string|null}
 */
export function buscarFAQ(texto) {
  const t = texto.toLowerCase();
  for (const item of FAQ) {
    if (item.perguntas.some((p) => t.includes(p))) {
      if (typeof item.resposta === "function") return item.resposta(t);
      return typeof item.resposta === "string" ? item.resposta : "";
    }
  }
  return null;
}

/**
 * Função principal que processa a mensagem recebida e retorna a resposta do bot.
 * @param {object} msg - Mensagem recebida (deve conter .text e .user)
 */
/**
 * Função principal que processa a mensagem recebida e retorna a resposta do bot.
 * @param {object} msg - Mensagem recebida (deve conter .text e .user)
 * @returns {Promise<string>}
 */
export async function botResponder(msg) {
  const texto = msg.text ? msg.text.trim().toLowerCase() : "";
  // Declara nomeUser de forma segura
  const nomeUser = msg.user ? String(msg.user).split(" ")[0] : "";

  // Sugestão de boas-vindas
  // Antes de responder boas-vindas, verifique se é FAQ
  const faqResp = await buscarFAQ(texto);
  if (faqResp)
    return typeof faqResp === "function" ? await faqResp(texto) : faqResp;

  if (texto.length < 3 || ["oi", "olá", "ola", "eae", "opa"].includes(texto)) {
    return 'Bem-vindo ao chat oficial da FURIA! 🦁🔥\n\nAqui você pode:\n• Perguntar sobre jogos, jogadores e curiosidades\n• Ver comandos com /help\n• Participar de enquetes e promoções\n\nExemplos: "Quando é o próximo jogo?", "Como funciona o chat?", "Quem é top fã?"\n\nFique à vontade, participe e mostre sua paixão pela FURIA! 💛🖤';
  }

  // Integração com API FURIA (dados dinâmicos)
  /**
   * Busca o elenco da modalidade na API
   * @param {string} modalidade
   * @returns {Promise<string>}
   */
  async function getElenco(modalidade) {
    try {
      const res = await fetch(`http://localhost:3031/api/elenco/${modalidade}`);
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) {
        // Se backend retornar mensagem amigável, mostre ela
        return data.erro || `Erro ao buscar elenco (${res.status}).`;
      }
      return data.elenco && data.elenco.length
        ? `Elenco de ${modalidade.toUpperCase()}: ${data.elenco.join(", ")}`
        : `Não encontrei elenco cadastrado para ${modalidade} 😕. Que tal descobrir as modalidades disponíveis? Use /modalidades para ver todas as opções e depois tente, por exemplo: /elenco cs2 🚀`;
    } catch (err) {
      console.error("Erro ao buscar elenco:", err);
      return "Erro ao buscar elenco. Tente novamente mais tarde.";
    }
  }

  // Comandos interativos exclusivos
  if (texto.startsWith("/elenco")) {
    // Corrige modalidade padrão para 'cs2' (não existe mais 'csgo')
    const mod = texto.split(" ")[1] || "cs2";
    return await getElenco(mod);
  }

  if (texto.startsWith("/estatisticas")) {
    const jogador = texto.split(" ")[1];
    if (!jogador) return "Informe o nick do jogador: /estatisticas <nick>";
    return (async () => {
      try {
        const res = await fetch(
          `http://localhost:3031/api/estatisticas/${jogador}`
        );
        if (!res.ok) throw new Error("Status " + res.status);
        const data = await res.json();
        if (!data.kills)
          return `Não encontrei estatísticas cadastradas para ${jogador} 📊. Confira os jogadores disponíveis com /elenco [modalidade] ou tente outro nick! Exemplo: /estatisticas art`;
        return `Estatísticas de ${jogador.toUpperCase()}\nKills: ${
          data.kills
        }\nDeaths: ${data.deaths}\nKDR: ${data.kdr}\nTime: ${
          data.time
        }\nCuriosidade: ${data.curiosidade}`;
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
        return "Erro ao buscar estatísticas.";
      }
    })();
  }

  if (texto.startsWith("/curiosidades")) {
    // Corrige modalidade padrão para 'cs2' (não existe mais 'csgo')
    const mod = texto.split(" ")[1] || "cs2";
    return (async () => {
      try {
        const res = await fetch(
          `http://localhost:3031/api/curiosidades/${mod}`
        );
        if (!res.ok) throw new Error("Status " + res.status);
        const data = await res.json();
        if (!data.curiosidades || !data.curiosidades.length)
          return `Ainda não temos curiosidades cadastradas para ${mod} 🤔. Explore outras modalidades com /modalidades ou pergunte sobre outra equipe! Exemplo: /curiosidades valorant`;
        return (
          `Curiosidades de ${mod.toUpperCase()}:\n- ` +
          data.curiosidades.join("\n- ")
        );
      } catch (err) {
        console.error("Erro ao buscar curiosidades:", err);
        return "Erro ao buscar curiosidades.";
      }
    })();
  }

  if (texto.startsWith("/modalidades")) {
    try {
      const res = await fetch("http://localhost:3031/api/modalidades");
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      if (!res.ok) {
        return data.erro || `Erro ao buscar modalidades (${res.status}).`;
      }
      if (!data.modalidades || !data.modalidades.length)
        return "Nenhuma modalidade cadastrada no momento. Tente novamente mais tarde ou explore outros comandos como /elenco!";
      return `Modalidades disponíveis: ${data.modalidades
        .map((m) => m.toUpperCase())
        .join(", ")}\n\nExemplo: /elenco cs2`;
    } catch (err) {
      console.error("Erro ao buscar modalidades:", err);
      return "Erro ao buscar modalidades. Tente novamente mais tarde!";
    }
  }

  if (texto.startsWith("/noticias")) {
    return (async () => {
      try {
        const res = await fetch("http://localhost:3031/api/noticias");
        if (!res.ok) throw new Error("Status " + res.status);
        const data = await res.json();
        if (!data.noticias || !data.noticias.length)
          return "Nenhuma notícia encontrada.";
        // Ajuste para o nome correto das propriedades do backend (titulo/data)
        return (
          "Últimas notícias da FURIA:\n" +
          data.noticias.map((n) => `• ${n.titulo} (${n.data})`).join("\n")
        );
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
        return "Erro ao buscar notícias.";
      }
    })();
  }

  const quizPerguntas = [
    {
      pergunta:
        "Quem é o IGL (In-Game Leader) do time principal de CS:GO da FURIA?",
      opcoes: ["A) arT", "B) yuurih", "C) KSCERATO", "D) chelo"],
      resposta: "A",
      explicacao: "arT é o IGL da FURIA!",
    },
    {
      pergunta: "Em que ano a FURIA foi fundada?",
      opcoes: ["A) 2015", "B) 2017", "C) 2019", "D) 2020"],
      resposta: "B",
      explicacao: "A FURIA foi fundada em 2017.",
    },
    {
      pergunta: "Qual modalidade a FURIA NÃO possui atualmente?",
      opcoes: ["A) CS:GO", "B) Valorant", "C) Free Fire", "D) Rocket League"],
      resposta: "C",
      explicacao: "A FURIA não possui equipe de Free Fire.",
    },
  ];
  if (!window._quizIndex) window._quizIndex = 0;
  if (!window._furiaQuizRanking) {
    try {
      window._furiaQuizRanking = JSON.parse(
        localStorage.getItem("furiaQuizRanking") || "{}"
      );
    } catch {
      window._furiaQuizRanking = {};
    }
  }

  if (window._furiaQuiz && window._furiaQuiz.ativo && /^[a-d]$/i.test(texto)) {
    const idx = window._furiaQuiz.index;
    const q = quizPerguntas[idx];
    window._furiaQuiz = null;
    window._quizIndex = (window._quizIndex + 1) % quizPerguntas.length;
    let userKey = nomeUser || "Anônimo";
    if (!window._furiaQuizRanking[userKey])
      window._furiaQuizRanking[userKey] = 0;
    let msg;
    if (texto.toUpperCase() === q.resposta) {
      window._furiaQuizRanking[userKey]++;
      msg = `Acertou! 🎉 ${q.explicacao}${
        nomeUser ? ` Parabéns, ${nomeUser}!` : ""
      }`;
      if (window._furiaQuizRanking[userKey] === 3) {
        msg += `\n🏅 Você atingiu 3 acertos no quiz! Fã raiz demais!`;
      }
    } else {
      msg = `Errou! 😅 ${q.explicacao}${
        nomeUser ? ` Tente de novo, ${nomeUser}!` : ""
      }`;
    }

    // Salva ranking
    try {
      localStorage.setItem(
        "furiaQuizRanking",
        JSON.stringify(window._furiaQuizRanking)
      );
    } catch (err) {
      console.warn(
        "Não foi possível salvar o ranking do quiz no localStorage:",
        err
      );
    }

    return msg;
  }

  // Enquete dinâmica (mock)
  if (texto.startsWith("/novaenquete")) {
    // Atualiza opções da enquete para refletir modalidades válidas
    window._furiaEnquete = {
      ativo: true,
      pergunta: "Qual modalidade você mais curte?",
      opcoes: ["1) CS2", "2) Valorant", "3) LoL", "4) Rocket League"],
      votos: {},
    };
    return "ENQUETE NOVA!\nQual modalidade você mais curte?\n1) CS2\n2) Valorant\n3) LoL\n4) Rocket League\n\nVote respondendo com o número!";
  }

  if (
    window._furiaEnquete &&
    window._furiaEnquete.ativo &&
    /^[1-4]$/.test(texto)
  ) {
    const voto = texto;
    let userKey = nomeUser || "Anônimo";
    window._furiaEnquete.votos[userKey] = voto;
    return `Voto registrado para opção ${voto}. Obrigado por participar!`;
  }

  if (texto.startsWith("/resultadoenquete")) {
    if (!window._furiaEnquete) return "Nenhuma enquete ativa.";
    const contagem = [0, 0, 0, 0];
    Object.values(window._furiaEnquete.votos).forEach((v) => {
      contagem[parseInt(v) - 1]++;
    });
    return `Resultado parcial da enquete:\n1) CS:GO: ${contagem[0]}\n2) Valorant: ${contagem[1]}\n3) LoL: ${contagem[2]}\n4) Rocket League: ${contagem[3]}`;
  }

  // Gamificação: XP, badges e missões
  if (!window._furiaMsgCount) window._furiaMsgCount = {};
  if (!window._furiaXP) window._furiaXP = {};
  if (!window._furiaBadges) window._furiaBadges = {};
  if (!window._furiaFlood) window._furiaFlood = {};
  if (nomeUser) {
    window._furiaMsgCount[nomeUser] =
      (window._furiaMsgCount[nomeUser] || 0) + 1;
    window._furiaXP[nomeUser] = (window._furiaXP[nomeUser] || 0) + 2;
    // Badge: Fã Ativo
    if (window._furiaMsgCount[nomeUser] === 10)
      window._furiaBadges[nomeUser] = "🏅 Fã Ativo";
    // Badge: Veterano do Chat
    if (window._furiaMsgCount[nomeUser] === 50)
      window._furiaBadges[nomeUser] = "👑 Veterano do Chat";
    // Badge: MVP
    if (window._furiaXP[nomeUser] >= 100)
      window._furiaBadges[nomeUser] = "⭐ Fã MVP";
    // Badge: Quiz Master
    if (window._furiaQuizRanking && window._furiaQuizRanking[nomeUser] >= 5)
      window._furiaBadges[nomeUser] = "🧠 Quiz Master";
    // Missão diária
    if (window._furiaMsgCount[nomeUser] % 20 === 0)
      return `Missão diária: Envie 5 mensagens sobre modalidades diferentes e ganhe XP extra!`;
    // Parabéns aniversário (mock)
    if (window._furiaMsgCount[nomeUser] === 30)
      return `Feliz aniversário de chat, ${nomeUser}! Você já mandou 30 mensagens! 🎉`;
    // Flood/spam
    if (!window._furiaFlood[nomeUser]) window._furiaFlood[nomeUser] = [];
    window._furiaFlood[nomeUser].push(Date.now());
    window._furiaFlood[nomeUser] = window._furiaFlood[nomeUser].filter(
      (ts) => Date.now() - ts < 60000
    );
    if (window._furiaFlood[nomeUser].length > 10)
      return `Calma, ${nomeUser}! Você está enviando mensagens muito rápido. Evite flood para não ser silenciado.`;
  }

  // Feedback automático
  if (
    nomeUser &&
    window._furiaMsgCount[nomeUser] % 10 === 0 &&
    window._furiaMsgCount[nomeUser] !== 0
  ) {
    return `Está curtindo o chat, ${nomeUser}? Envie sugestões usando /feedback!`;
  }

  // Badge visual e XP info
  if (texto.startsWith("/minhabadge")) {
    return `${nomeUser}, sua badge: ${
      window._furiaBadges[nomeUser] || "Nenhuma ainda"
    } | XP: ${window._furiaXP[nomeUser] || 0}`;
  }

  // Ranking de XP
  if (texto.startsWith("/rankingxp")) {
    const ranking = Object.entries(window._furiaXP || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([user, xp], i) => `${i + 1}. ${user}: ${xp} XP`)
      .join("\n");
    return `Ranking de Fãs por XP:\n${
      ranking || "Ninguém tem XP ainda!"
    }\nParticipe mais para subir no ranking!`;
  }

  // Personalização: lembrar modalidade preferida
  if (texto.startsWith("/preferemodalidade")) {
    const mod = texto.split(" ")[1];
    if (mod) {
      window._furiaPreferida = window._furiaPreferida || {};
      window._furiaPreferida[nomeUser] = mod;
      return `Entendido, ${nomeUser}! Vou priorizar notícias e curiosidades sobre ${mod.toUpperCase()} para você.`;
    }

    return "Use /preferemodalidade <nome> para definir sua modalidade favorita.";
  }

  if (window._furiaPreferida && window._furiaPreferida[nomeUser]) {
    if (/not[ií]cia|curiosidade|novidade/.test(texto)) {
      return `Sua modalidade preferida é ${window._furiaPreferida[
        nomeUser
      ].toUpperCase()}. Quer saber algo específico? Use /info ou /estatisticas dessa modalidade!`;
    }
  }

  // Moderação: resposta para denúncia
  if (texto.startsWith("/denunciar")) {
    return `Sua denúncia foi recebida! Nossa equipe irá analisar. Obrigado por ajudar a manter o chat seguro, ${
      nomeUser || "torcedor"
    }!`;
  }

  // Moderação proativa
  if (
    /https?:\/\/|www\.|spam|merda|palavr[aã]o|ofensa|xingamento|palhaço|burro|idiota|otário|lixo/.test(
      texto
    )
  ) {
    return `Atenção: Respeite as regras do chat! Não são permitidos links suspeitos, ofensas ou spam. Torcida FURIA é respeito e união!${
      nomeUser ? ` ${nomeUser}, mantenha o fair play!` : ""
    }`;
  }

  // Sugestão de comandos por contexto
  if (/kscerato|yuurih|art|chelo|saffee/.test(texto)) {
    return `Quer saber estatísticas do jogador? Use /estatisticas! Para votar em MVP, use /mvp e o nome do seu favorito.`;
  }

  if (/modalidade|cs:go|valorant|lol|rocket league|apex|fortnite/.test(texto)) {
    return `Quer saber mais sobre as modalidades? Use /info, /estatisticas ou pergunte sobre elenco, próximos jogos e curiosidades!`;
  }

  // Comando de feedback
  if (texto.startsWith("/feedback"))
    return `Sua opinião é muito importante!${
      nomeUser ? ` Obrigado por contribuir, ${nomeUser}!` : ""
    } Envie sugestões ou feedbacks que a staff irá analisar com carinho.`;

  // Alerta de regras e moderação
  if (
    /(burro|idiota|otário|lixo|spam|merda|palavr[aã]o|ofensa|xingamento|palhaço)/.test(
      texto
    )
  ) {
    return `Atenção: Respeite as regras do chat! Não são permitidas ofensas, xingamentos ou spam. Torcida FURIA é respeito e união!${
      nomeUser ? ` ${nomeUser}, mantenha o fair play!` : ""
    }`;
  }

  // Comando de denúncia
  if (texto.startsWith("/denunciar")) {
    return `Sua denúncia foi registrada! A staff irá analisar com atenção. Obrigado por ajudar a manter o chat seguro, ${
      nomeUser || "torcedor"
    }!`;
  }

  // Comandos rápidos
  if (texto.startsWith("/grito")) return "AAAAAAQUI É FUUUUURIAAAAA! 🔥🦁";
  if (texto.startsWith("/salve")) return "Salve, salve! A torcida tá on!";
  if (texto.startsWith("/meme")) return "Manda aquele meme da FURIA! 😎";
  if (texto.startsWith("/help") || texto.startsWith("/ajuda")) {
    return "🤖 Comandos disponíveis: /grito, /salve, /meme, /curiosidade, /info, /estatisticas, /mvp, /regras, /comandos, /links, /faq, /staff, /promo, /suporte, /sugestao, /feedback.\nPergunte também sobre jogadores, placares, eventos, curiosidades e mais!";
  }

  if (texto.startsWith("/info"))
    return "FURIA Esports: Org brasileira de CS:GO, paixão, garra e inovação nos Esportes!";
  if (texto.startsWith("/estatisticas"))
    return "Estatísticas recentes: arT (IGL), KSCERATO (clutch master), yuurih (entry), chelo (support), saffee (AWPer). Quer saber de algum jogador específico? Pergunte!";
  if (texto.startsWith("/regras"))
    return "Regras do chat: Respeite todos, sem spam, sem ofensas, sem links suspeitos, e divirta-se!";
  if (texto.startsWith("/comandos"))
    return "Comandos: /grito, /salve, /meme, /curiosidade, /info, /estatisticas, /mvp, /regras, /faq, /links, /ajuda, /staff, /promo, /suporte, /sugestao, /feedback.";
  if (texto.startsWith("/links"))
    return "Links oficiais: https://furia.gg | Twitter: @FURIA | Instagram: @furia | Twitch: twitch.tv/furiagg | Discord: discord.gg/furia";
  if (texto.startsWith("/faq"))
    return "FAQ: Tire dúvidas sobre o time, ranking, comandos, próximos jogos, sorteios, promoções, staff, comunidade e mais!";
  if (texto.startsWith("/staff"))
    return "Staff FURIA: André Akkari (fundador), Jaime Pádua (CEO), Guerri (coach), e muitos outros profissionais dedicados!";
  if (texto.startsWith("/promo"))
    return "Fique ligado em promoções e sorteios! Siga as redes sociais e participe das lives para não perder nada.";
  if (texto.startsWith("/suporte"))
    return "Precisa de suporte técnico? Relate seu problema aqui ou envie um e-mail para suporte@furia.gg.";
  if (texto.startsWith("/sugestao"))
    return "Sua opinião é muito importante! Envie sugestões ou feedbacks que a staff irá analisar com carinho.";
  if (texto.startsWith("/mvp") || /quem.*mvp|votar.*mvp/.test(texto))
    return "Vote no MVP do round: arT, KSCERATO, yuurih, chelo, saffee. Escreva /mvp e o nome do seu escolhido!";

  // Modalidade: CS:GO
  if (/cs:go|csgo|cs go|counter[- ]?strike|furia cs/.test(texto)) {
    return `CS:GO FURIA 🦁\n\nElenco principal: arT (IGL), yuurih, KSCERATO, chelo, saffee.\nPróximo jogo: FURIA vs Team Liquid - 30/04/2025, 18h (Brasília).\nCuriosidade: A FURIA é referência mundial no estilo agressivo e inovador no CS:GO.\nHistória: Fundada em 2017, rapidamente se tornou uma das principais organizações do cenário mundial, conquistando títulos e fãs pelo mundo!`;
  }

  // Modalidade: Valorant
  if (/valorant|furia valorant|time valorant/.test(texto)) {
    return `VALORANT FURIA 🦁\n\nElenco principal: Mazin, QCK, Khalil, mwzera, Quick.\nPróximo jogo: FURIA vs LOUD - 02/05/2025, 20h.\nCuriosidade: A FURIA é destaque no cenário brasileiro, sempre chegando forte nos playoffs.\nHistória: A entrada no Valorant foi em 2021, consolidando a FURIA como multi-campeã em FPS.`;
  }

  // Modalidade: Kings League
  if (
    /kings league|liga dos reis|furia kings league|time kings league/.test(
      texto
    )
  ) {
    return `KINGS LEAGUE FURIA ⚽🦁\n\nElenco: Fred (Presidente), jogadores convidados, comissão técnica dedicada.\nPróximo jogo: FURIA vs Aniquiladores - 05/05/2025, 15h.\nCuriosidade: A Kings League mistura futebol 7 com regras inovadoras e muita resenha!\nHistória: A FURIA entrou na Kings League em 2024, levando sua torcida e paixão para o futebol de entretenimento.`;
  }

  // Modalidade: League of Legends
  if (/league of legends|lol\b|furia lol|time lol/.test(texto)) {
    return `LEAGUE OF LEGENDS FURIA 🦁\n\nElenco: fNb (Top), Goot (Jungle), Envy (Mid), Netuno (ADC), RedBert (Suporte).\nPróximo jogo: FURIA vs paiN Gaming - 28/04/2025, 17h.\nCuriosidade: A FURIA já chegou a finais do CBLOL e é conhecida pelo jogo agressivo.\nHistória: A FURIA entrou no LoL em 2020 e rapidamente virou protagonista do cenário brasileiro.`;
  }

  // Modalidade: Rocket League
  if (/rocket league|furia rocket|time rocket/.test(texto)) {
    return `ROCKET LEAGUE FURIA 🦁🚗\n\nElenco: CaioTG1, Card, Yanxnz.\nPróximo jogo: FURIA vs G2 Esports - 01/05/2025, 16h.\nCuriosidade: A FURIA ficou entre os melhores do mundo no mundial de Rocket League!\nHistória: A FURIA entrou no Rocket League em 2021 e logo se tornou referência nas Américas.`;
  }

  // Modalidade: Apex Legends
  if (/apex legends|furia apex|time apex/.test(texto)) {
    return `APEX LEGENDS FURIA 🦁\n\nElenco: HisWattson, Pandxrz, Zer0.\nPróximo jogo: FURIA vs TSM - 03/05/2025, 19h.\nCuriosidade: A FURIA já venceu etapas internacionais e é temida no cenário global.\nHistória: A FURIA entrou no Apex Legends em 2022 e já conquistou títulos importantes.`;
  }

  // Modalidade: Fortnite
  if (/fortnite|furia fortnite|time fortnite/.test(texto)) {
    return `FORTNITE FURIA 🦁\n\nElenco: Pulga, leleo, king.\nPróximo jogo: FURIA na FNCS - 04/05/2025, 18h.\nCuriosidade: A FURIA é uma das principais equipes de Fortnite do Brasil.\nHistória: Desde 2019, a FURIA revela talentos e conquista títulos no cenário de Fortnite.`;
  }

  // Perguntas sobre jogos, placar, datas e eventos
  if (
    /(pr[oó]ximo|quando|data|que dia|qual dia|agenda).*(jogo|partida|evento|campeonato)/.test(
      texto
    )
  )
    return "Fonte: informações oficiais da FURIA. O próximo jogo/evento da FURIA será anunciado em breve! Confira a agenda oficial no site ou nas redes sociais.";
  if (/placar|score|resultado/.test(texto))
    return "Fonte: informações oficiais da FURIA. O placar dos jogos é atualizado ao vivo aqui e nas nossas redes sociais. Pergunte pelo último resultado ou aguarde a próxima partida!";
  if (/(hor[áa]rio|que horas|quando).*(jogo|partida|evento)/.test(texto))
    return "Fonte: informações oficiais da FURIA. O horário do próximo jogo será divulgado assim que confirmado. Fique de olho no canal e nas redes!";
  if (/(onde|local|mapa).*(jogo|partida|evento)/.test(texto))
    return "Fonte: informações oficiais da FURIA. Os jogos da FURIA podem acontecer em arenas pelo mundo ou online. Veja o local do próximo confronto nas nossas redes!";
  if (/como assistir|onde assistir|link.*transmissao|twitch|stream/.test(texto))
    return "Fonte: informações oficiais da FURIA. Assista aos jogos da FURIA ao vivo em twitch.tv/furiagg e fique ligado no canal #geral para links de transmissão!";

  // Jogadores e staff
  if (/quem.*art/.test(texto))
    return "Fonte: informações oficiais da FURIA. arT é o capitão e IGL da FURIA, famoso pelo estilo agressivo e tático.";
  if (/quem.*kscerato/.test(texto))
    return "Fonte: informações oficiais da FURIA. KSCERATO é um dos melhores clutchers do Brasil e peça fundamental da FURIA!";
  if (/quem.*yuurih/.test(texto))
    return "Fonte: informações oficiais da FURIA. yuurih é entry fragger da FURIA, conhecido por sua mira e agressividade.";
  if (/quem.*chelo/.test(texto))
    return "Fonte: informações oficiais da FURIA. chelo é o suporte do time, sempre pronto para ajudar a equipe nas situações difíceis.";
  if (/quem.*saffee/.test(texto))
    return "Fonte: informações oficiais da FURIA. saffee é o AWPer da FURIA, especialista em rounds decisivos!";
  if (/quem.*guerri/.test(texto))
    return "Fonte: informações oficiais da FURIA. guerri é o coach da FURIA e grande responsável pela estratégia do time!";
  if (/kingsleague/.test(texto))
    return "Fonte: informações oficiais da FURIA. A FURIA também está presente na Kings League, mostrando garra e inovação no futebol 7!";
  if (/quem.*(jogadores|line|lineup|time|equipe)/.test(texto))
    return "Fonte: informações oficiais da FURIA. Escalação atual: arT, KSCERATO, yuurih, chelo e saffee. Coach: guerri.";
  if (/quem.*(fundador|ceo|staff|diretor)/.test(texto))
    return "Fonte: informações oficiais da FURIA. FURIA foi fundada por André Akkari e Jaime Pádua. CEO: Jaime Pádua. A staff conta com profissionais de várias áreas!";

  // Ranking, estatísticas, sorteios, promoções
  if (/como.*ranking|funciona.*ranking/.test(texto))
    return "Fonte: informações oficiais da FURIA. O ranking de fãs é baseado na quantidade de mensagens enviadas no chat. Quanto mais participa, maior sua posição!";
  if (/estat[íi]stica|stats/.test(texto))
    return "Fonte: informações oficiais da FURIA. Confira as estatísticas dos jogadores e do time usando /estatisticas ou pergunte sobre um jogador específico!";
  if (/sorteio|participar.*sorteio|promo[çc][aã]o/.test(texto))
    return "Fonte: informações oficiais da FURIA. Sorteios e promoções são anunciados durante transmissões e nas redes sociais. Participe e boa sorte!";

  // Enquetes e votações

  // Curiosidades, história, mascote, cultura gamer
  if (/hist[óo]rico|conquista|t[íi]tulo|campeonato/.test(texto))
    return "Fonte: informações oficiais da FURIA. A FURIA já conquistou títulos nacionais e internacionais. Veja mais em https://furia.gg";
  if (/mascote|logo|pantera/.test(texto))
    return "Fonte: informações oficiais da FURIA. A FURIA tem como mascote a Pantera, símbolo de força, agilidade e espírito selvagem!";
  if (/fundador|hist[óo]ria/.test(texto))
    return "Fonte: informações oficiais da FURIA. A FURIA foi fundada em 2017 e já é referência no e-sports mundial!";
  if (/curiosidade|sabia que|fato interessante/.test(texto))
    return "Fonte: informações oficiais da FURIA. Curiosidade: A FURIA foi a primeira equipe brasileira a chegar ao top 3 do ranking mundial de CS:GO em 2019!";
  if (/meme|piada|zuera|zueira/.test(texto))
    return "Aqui é FURIA, mas também é zuera! Compartilhe memes e divirta-se com a galera!";

  // Onboarding, dicas de uso, segurança
  if (/como usar|como funciona|dica|tutorial|ajuda/.test(texto))
    return "Para usar o chat, selecione um canal, digite sua mensagem e envie. Use /comandos para ver opções especiais! Sempre respeite as regras e divirta-se.";
  if (/seguran[çc]a|privacidade|spam|phishing|golpe/.test(texto))
    return "Atenção: Nunca compartilhe informações pessoais e denuncie mensagens suspeitas à staff.";

  // Perguntas sobre o bot
  if (/quem.*bot|o que.*bot|como.*bot|fun[çc][aã]o.*bot/.test(texto))
    return "Eu sou o Torcida FURIA Bot! Estou aqui para ajudar, responder dúvidas, animar o chat e trazer informações sobre tudo da FURIA.";
  if (/atualiza[çc][aã]o|novidade|feature|melhoria/.test(texto))
    return "O bot está sempre evoluindo! Envie sugestões usando /sugestao.";

  // Resposta padrão humanizada
  // Engajamento especial para fãs e ranking

  // Respostas padrão melhoradas
  // Respostas padrão sem repetição e contextuais
  if (
    !window._filaRespostasPadrao ||
    !Array.isArray(window._filaRespostasPadrao) ||
    window._filaRespostasPadrao.length === 0
  ) {
    // Embaralha as respostas ao iniciar ou quando esgotar
    window._filaRespostasPadrao = [
      `Ficou com dúvida? Pergunte sobre a FURIA, jogadores, jogos ou curiosidades! ${
        nomeUser ? `Conta comigo, ${nomeUser}!` : "Estou aqui pra ajudar."
      }  Use /help para ver todos os comandos.`,
      `Quer saber algo sobre a FURIA? Manda sua pergunta e bora conversar!${
        nomeUser ? " " + nomeUser + "," : ""
      }`,
      "A FURIA é paixão e garra! Pergunte o que quiser, participe do chat e mostre sua torcida! ",
      `Curte o time? Conta pra mim o que você mais gosta na FURIA ou tire sua dúvida!${
        nomeUser ? " " + nomeUser + "," : ""
      } Já participou das enquetes? Fique ligado!`,
      "Aqui é FURIA, aqui é família! Use /help para ver comandos e fique de olho nas promoções.",
    ].sort(() => Math.random() - 0.5);
  }

  return window._filaRespostasPadrao.pop();
}

export default botResponder;
