const express = require('express');
const router = express.Router();
const db = require('../firebase');
const admin = require('firebase-admin');

/**
 * Middleware de autenticação Firebase
 * Verifica o token Bearer e adiciona o usuário autenticado em req.user
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token de autenticação ausente' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
}

// GET estatísticas de jogador
const { resolveModalidade } = require('../utils/modalidadeSynonyms');

/**
 * GET estatísticas de jogador
 * Query param opcional: modalidade
 * @route GET /:jogador
 */
/**
 * GET estatísticas de um jogador.
 * Se o parâmetro não for um jogador válido, retorna erro explicativo.
 * @route GET /:jogador
 */
router.get('/:jogador', async (req, res) => {
  const nick = req.params.jogador.toLowerCase();
  const { modalidade } = req.query;
  try {
    const doc = await db.collection('estatisticas').doc(nick).get();
    if (!doc.exists) {
      return res.status(404).json({ erro: 'Jogador não encontrado' });
    }
    const data = doc.data();
    if (modalidade) {
      const modKey = resolveModalidade(modalidade);
      if (data.modalidade !== modKey) {
        return res.status(404).json({ erro: 'Estatísticas para modalidade não encontradas' });
      }
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar estatísticas', detalhes: e.message });
  }
});

// POST - adicionar estatísticas de jogador
/**
 * POST - adicionar estatísticas de jogador
 * @route POST /:jogador
 * @access Authenticated
 */
router.post('/:jogador', authenticate, async (req, res) => {
  const nick = req.params.jogador.toLowerCase();
  const { modalidade, ...stats } = req.body;
  if (!modalidade || Object.keys(stats).length === 0) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade e pelo menos um dado de estatística' });
  }
  try {
    await db.collection('estatisticas').doc(nick).set({ modalidade: modalidade.toLowerCase(), ...stats });
    res.status(201).json({ mensagem: 'Estatísticas salvas com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao salvar estatísticas', detalhes: e.message });
  }
});

// PUT - atualizar estatísticas de jogador
/**
 * PUT - atualizar estatísticas de jogador
 * @route PUT /:jogador
 * @access Authenticated
 */
router.put('/:jogador', authenticate, async (req, res) => {
  const nick = req.params.jogador.toLowerCase();
  const { modalidade, ...stats } = req.body;
  if (!modalidade || Object.keys(stats).length === 0) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade e pelo menos um dado de estatística' });
  }
  try {
    await db.collection('estatisticas').doc(nick).update({ modalidade: modalidade.toLowerCase(), ...stats });
    res.json({ mensagem: 'Estatísticas atualizadas com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar estatísticas', detalhes: e.message });
  }
});

// DELETE - remover estatísticas de jogador
/**
 * DELETE - remover estatísticas de jogador
 * @route DELETE /:jogador
 * @access Authenticated
 * @description Remove as estatísticas de um jogador. Se o parâmetro não for um jogador válido, retorna erro explicativo.
 */
router.delete('/:jogador', authenticate, async (req, res) => {
  const jogador = req.params.jogador.toLowerCase();

  // Tratamento: impedir consulta por modalidade e comandos reservados
  const modalidades = [
    'cs2', 'csgo', 'valorant', 'lol', 'rocketleague', 'apex', 'rainbowsix', 'kingsleague', 'fifa'
  ];
  if (!jogador || jogador === 'help' || jogador === 'comandos' || modalidades.includes(jogador)) {
    return res.status(400).json({ erro: 'Informe um jogador válido para consultar estatísticas. Consulte /elenco para ver os jogadores.' });
  }

  try {
    await db.collection('estatisticas').doc(jogador).delete();
    res.json({ mensagem: 'Estatísticas removidas com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover estatísticas', detalhes: e.message });
  }
});

module.exports = router;
