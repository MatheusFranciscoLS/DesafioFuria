const express = require('express');
const router = express.Router();
const db = require('../firebase');
const admin = require('firebase-admin');
const { modalidadeMap } = require('../utils/modalidadeSynonyms');
const { fuzzySearchModalidade } = require('../utils/fuzzyModalidade');

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

// GET - listar todas as modalidades
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('modalidades').get();
    const modalidades = snapshot.docs.map(doc => doc.id);
    res.json({ modalidades });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar modalidades', detalhes: e.message });
  }
});

// POST - adicionar modalidade
router.post('/', authenticate, async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: 'Campo obrigatório: nome' });
  }
  try {
    await db.collection('modalidades').doc(nome.toLowerCase()).set({ nome: nome.toLowerCase() });
    res.status(201).json({ mensagem: 'Modalidade adicionada', nome: nome.toLowerCase() });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao adicionar modalidade', detalhes: e.message });
  }
});

// PUT - atualizar modalidade
router.put('/:nome', authenticate, async (req, res) => {
  const { nome } = req.params;
  const { novoNome } = req.body;
  if (!novoNome) {
    return res.status(400).json({ erro: 'Campo obrigatório: novoNome' });
  }
  try {
    const docRef = db.collection('modalidades').doc(nome.toLowerCase());
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ erro: 'Modalidade não encontrada' });
    }
    await db.collection('modalidades').doc(novoNome.toLowerCase()).set({ nome: novoNome.toLowerCase() });
    await docRef.delete();
    res.json({ mensagem: 'Modalidade atualizada', nomeAntigo: nome.toLowerCase(), novoNome: novoNome.toLowerCase() });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar modalidade', detalhes: e.message });
  }
});

// DELETE - remover modalidade
router.delete('/:nome', authenticate, async (req, res) => {
  const { nome } = req.params;
  try {
    await db.collection('modalidades').doc(nome.toLowerCase()).delete();
    res.json({ mensagem: 'Modalidade removida', nome: nome.toLowerCase() });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover modalidade', detalhes: e.message });
  }
});

module.exports = router;
