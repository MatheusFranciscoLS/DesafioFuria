const express = require('express');
const router = express.Router();
const db = require('../firebase');
const admin = require('firebase-admin');

// Middleware de autenticação Firebase
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
router.get('/:jogador', async (req, res) => {
  const nick = req.params.jogador.toLowerCase();
  try {
    const doc = await db.collection('estatisticas').doc(nick).get();
    if (!doc.exists) {
      return res.status(404).json({ erro: 'Jogador não encontrado' });
    }
    res.json(doc.data());
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar estatísticas', detalhes: e.message });
  }
});

// POST - adicionar estatísticas de jogador
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
router.delete('/:jogador', authenticate, async (req, res) => {
  const nick = req.params.jogador.toLowerCase();
  try {
    await db.collection('estatisticas').doc(nick).delete();
    res.json({ mensagem: 'Estatísticas removidas com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover estatísticas', detalhes: e.message });
  }
});

module.exports = router;
