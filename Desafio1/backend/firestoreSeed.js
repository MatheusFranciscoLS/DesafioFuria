// Script para popular o Firestore com dados iniciais para a Torcida FURIA
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

async function seed() {
  // Modalidades (do furia-modalidades.js)
  await db.collection('modalidades').doc('list').set({
    modalidades: [
      'cs2', 'valorant', 'rainbowsix', 'apex', 'lol', 'rocketleague', 'pubg', 'futebol7'
    ]
  });

  // Elenco (do elenco.json)
  await db.collection('elenco').doc('cs2').set({ jogadores: ["arT", "yuurih", "KSCERATO", "chelo", "saffee"] });
  await db.collection('elenco').doc('valorant').set({ jogadores: ["Mazin", "QCK", "Khalil", "mwzera", "Quick"] });
  await db.collection('elenco').doc('rainbowsix').set({ jogadores: ["R4re", "Handyy", "Miracle", "Fntzy", "Lenda"] });
  await db.collection('elenco').doc('fifa').set({ jogadores: ["Gabrielpn", "Resende"] });
  await db.collection('elenco').doc('kingsleague').set({ jogadores: ["Fred", "Igor Rezende", "Lucas Freestyle", "Bruninho", "Rafinha"] });
  await db.collection('elenco').doc('apex').set({ jogadores: ["Notted", "Coutzzera", "FpsGod"] });
  await db.collection('elenco').doc('lol').set({ jogadores: ["fNb", "Goot", "Envy", "Netuno", "RedBert"] });
  await db.collection('elenco').doc('rocketleague').set({ jogadores: ["CaioTG1", "Card", "Repi", "Drufus"] });

  // Estatísticas (do estatisticas.json)
  await db.collection('estatisticas').doc('art').set({ kills: 120, deaths: 90, kdr: 1.33, time: "FURIA", curiosidade: "IGL mais agressivo do Brasil!", modalidade: "cs2" });
  await db.collection('estatisticas').doc('yuurih').set({ kills: 140, deaths: 80, kdr: 1.75, time: "FURIA", curiosidade: "Especialista em entry frag.", modalidade: "cs2" });
  await db.collection('estatisticas').doc('kscerato').set({ kills: 130, deaths: 85, kdr: 1.53, time: "FURIA", curiosidade: "Clutch master.", modalidade: "cs2" });
  await db.collection('estatisticas').doc('mazinn').set({ kills: 95, deaths: 70, kdr: 1.36, time: "FURIA", curiosidade: "Destaque no Valorant.", modalidade: "valorant" });
  await db.collection('estatisticas').doc('qck').set({ kills: 110, deaths: 85, kdr: 1.29, time: "FURIA", curiosidade: "Duelista ágil.", modalidade: "valorant" });
  await db.collection('estatisticas').doc('r4re').set({ kills: 80, deaths: 60, kdr: 1.33, time: "FURIA", curiosidade: "Capitão da equipe R6.", modalidade: "rainbowsix" });
  await db.collection('estatisticas').doc('gabrielpn').set({ gols: 27, assistencias: 12, partidas: 18, time: "FURIA", curiosidade: "Campeão e-Brasileirão.", modalidade: "fifa" });
  await db.collection('estatisticas').doc('fred').set({ gols: 10, assistencias: 7, partidas: 9, time: "FURIA", curiosidade: "Craque da Kings League.", modalidade: "kingsleague" });
  await db.collection('estatisticas').doc('notted').set({ abates: 200, partidas: 15, time: "FURIA", curiosidade: "Top 1 ALGS.", modalidade: "apex" });
  await db.collection('estatisticas').doc('fnb').set({ kills: 20, deaths: 8, kdr: 2.5, time: "FURIA", curiosidade: "Top laner do CBLOL.", modalidade: "lol" });
  await db.collection('estatisticas').doc('caiotg1').set({ gols: 12, saves: 30, partidas: 5, time: "FURIA", curiosidade: "Campeão brasileiro de Rocket League.", modalidade: "rocketleague" });

  // Curiosidades (do curiosidades.json)
  await db.collection('curiosidades').doc('cs2').set({ curiosidades: [
    "A FURIA foi a primeira equipe brasileira a chegar ao top 3 mundial em 2019.",
    "O estilo agressivo da FURIA é referência internacional."
  ] });
  await db.collection('curiosidades').doc('valorant').set({ curiosidades: [
    "A FURIA entrou no Valorant em 2021.",
    "Sempre chega forte nos playoffs."
  ] });
  await db.collection('curiosidades').doc('rainbowsix').set({ curiosidades: [
    "A FURIA é uma das equipes mais jovens do cenário nacional.",
    "Equipe conhecida por estratégias inovadoras."
  ] });
  await db.collection('curiosidades').doc('fifa').set({ curiosidades: [
    "A FURIA já foi campeã do e-Brasileirão.",
    "Time com jogadores de destaque internacional."
  ] });
  await db.collection('curiosidades').doc('kingsleague').set({ curiosidades: [
    "A FURIA foi uma das primeiras equipes brasileiras na Kings League.",
    "Time comandado por Fred, ex-Desimpedidos."
  ] });
  await db.collection('curiosidades').doc('apex').set({ curiosidades: [
    "Equipe com presença constante nas finais da ALGS.",
    "Jogadores conhecidos pelo estilo agressivo."
  ] });
  await db.collection('curiosidades').doc('lol').set({ curiosidades: [
    "A FURIA chegou à semifinal do CBLOL 2022.",
    "Time conhecido pela torcida apaixonada."
  ] });
  await db.collection('curiosidades').doc('rocketleague').set({ curiosidades: [
    "FURIA é referência na América do Sul.",
    "Primeira organização brasileira a disputar Mundial RLCS."
  ] });

  // Jogos (do jogos.json)
  await db.collection('jogos').add({ modalidade: "cs2", adversario: "NAVI", data: "2025-05-01", hora: "18:00", torneio: "Major" });
  await db.collection('jogos').add({ modalidade: "valorant", adversario: "LOUD", data: "2025-05-02", hora: "20:00", torneio: "Champions" });
  await db.collection('jogos').add({ modalidade: "rainbowsix", adversario: "Liquid", data: "2025-05-03", hora: "17:00", torneio: "Brasileirão R6" });
  await db.collection('jogos').add({ modalidade: "fifa", adversario: "SPQR", data: "2025-05-04", hora: "21:00", torneio: "e-Brasileirão" });
  await db.collection('jogos').add({ modalidade: "kingsleague", adversario: "Rayo de Barcelona", data: "2025-05-05", hora: "19:00", torneio: "Kings League" });
  await db.collection('jogos').add({ modalidade: "apex", adversario: "LOUD", data: "2025-05-06", hora: "20:00", torneio: "ALGS" });
  await db.collection('jogos').add({ modalidade: "lol", adversario: "paiN", data: "2025-05-07", hora: "16:00", torneio: "CBLOL" });
  await db.collection('jogos').add({ modalidade: "rocketleague", adversario: "Team BDS", data: "2025-05-08", hora: "15:00", torneio: "RLCS" });

  // Placares (do placares.json)
  await db.collection('placares').add({ modalidade: "cs2", resultado: "FURIA 16x12 NAVI", data: "2025-04-20" });
  await db.collection('placares').add({ modalidade: "valorant", resultado: "FURIA 13x11 LOUD", data: "2025-04-19" });
  await db.collection('placares').add({ modalidade: "rainbowsix", resultado: "FURIA 7x5 Liquid", data: "2025-04-18" });
  await db.collection('placares').add({ modalidade: "fifa", resultado: "FURIA 3x2 SPQR", data: "2025-04-17" });
  await db.collection('placares').add({ modalidade: "kingsleague", resultado: "FURIA 4x3 Rayo de Barcelona", data: "2025-04-16" });
  await db.collection('placares').add({ modalidade: "apex", resultado: "FURIA Top 2", data: "2025-04-15" });
  await db.collection('placares').add({ modalidade: "lol", resultado: "FURIA 2x0 paiN", data: "2025-04-14" });
  await db.collection('placares').add({ modalidade: "rocketleague", resultado: "FURIA 3x2 Team BDS", data: "2025-04-13" });

  // Notícias (do noticias.json)
  await db.collection('noticias').add({ titulo: "FURIA vence NAVI no Major de CS2!", data: "2025-04-20", modalidade: "cs2" });
  await db.collection('noticias').add({ titulo: "Nova line-up de Valorant anunciada", data: "2025-04-19", modalidade: "valorant" });
  await db.collection('noticias').add({ titulo: "FURIA faz jogo épico contra Liquid no Rainbow Six", data: "2025-04-18", modalidade: "rainbowsix" });
  await db.collection('noticias').add({ titulo: "FURIA conquista título no e-Brasileirão de FIFA", data: "2025-04-17", modalidade: "fifa" });
  await db.collection('noticias').add({ titulo: "Fred marca golaço pela FURIA na Kings League", data: "2025-04-16", modalidade: "kingsleague" });
  await db.collection('noticias').add({ titulo: "FURIA garante vaga nas finais da ALGS de Apex", data: "2025-04-15", modalidade: "apex" });
  await db.collection('noticias').add({ titulo: "FURIA avança para playoffs do CBLOL", data: "2025-04-14", modalidade: "lol" });
  await db.collection('noticias').add({ titulo: "FURIA conquista título no Rocket League", data: "2025-04-13", modalidade: "rocketleague" });

  console.log('Firestore populado com dados completos para todas as entidades!');
  process.exit(0);
}

seed().catch(e => {
  console.error('Erro ao popular o Firestore:', e);
  process.exit(1);
});
