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

// GET curiosidades por modalidade
router.get('/:modalidade', async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  try {
    const doc = await db.collection('curiosidades').doc(mod).get();
    if (!doc.exists) {
      return res.status(404).json({ erro: 'Modalidade não encontrada' });
    }
    res.json({ curiosidades: doc.data().curiosidades });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar curiosidades', detalhes: e.message });
  }
});

// POST - adicionar curiosidades de uma modalidade
router.post('/:modalidade', authenticate, async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  const { curiosidades } = req.body;
  if (!Array.isArray(curiosidades) || curiosidades.length === 0) {
    return res.status(400).json({ erro: 'Curiosidades deve ser um array não vazio' });
  }
  try {
    await db.collection('curiosidades').doc(mod).set({ curiosidades });
    res.status(201).json({ mensagem: 'Curiosidades salvas com sucesso', curiosidades });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao salvar curiosidades', detalhes: e.message });
  }
});

// PUT - atualizar curiosidades de uma modalidade
router.put('/:modalidade', authenticate, async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  const { curiosidades } = req.body;
  if (!Array.isArray(curiosidades) || curiosidades.length === 0) {
    return res.status(400).json({ erro: 'Curiosidades deve ser um array não vazio' });
  }
  try {
    await db.collection('curiosidades').doc(mod).update({ curiosidades });
    res.json({ mensagem: 'Curiosidades atualizadas com sucesso', curiosidades });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar curiosidades', detalhes: e.message });
  }
});

// DELETE - remover curiosidades de uma modalidade
router.delete('/:modalidade', authenticate, async (req, res) => {
  const mod = req.params.modalidade.toLowerCase();
  try {
    await db.collection('curiosidades').doc(mod).delete();
    res.json({ mensagem: 'Curiosidades removidas com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover curiosidades', detalhes: e.message });
  }
});

module.exports = router;
