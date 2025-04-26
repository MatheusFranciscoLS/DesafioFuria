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

// GET placares (com filtro opcional por modalidade)
router.get('/', async (req, res) => {
  const { modalidade } = req.query;
  try {
    let query = db.collection('placares');
    if (modalidade) {
      query = query.where('modalidade', '==', modalidade.toLowerCase());
    }
    const snapshot = await query.get();
    const placares = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ placares });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar placares', detalhes: e.message });
  }
});

// POST - adicionar placar
router.post('/', authenticate, async (req, res) => {
  const { modalidade, resultado, data } = req.body;
  if (!modalidade || !resultado || !data) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade, resultado, data' });
  }
  try {
    const docRef = await db.collection('placares').add({ modalidade: modalidade.toLowerCase(), resultado, data });
    res.status(201).json({ mensagem: 'Placar adicionado', id: docRef.id });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao adicionar placar', detalhes: e.message });
  }
});

// PUT - atualizar placar
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { modalidade, resultado, data } = req.body;
  if (!modalidade || !resultado || !data) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade, resultado, data' });
  }
  try {
    await db.collection('placares').doc(id).update({ modalidade: modalidade.toLowerCase(), resultado, data });
    res.json({ mensagem: 'Placar atualizado com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar placar', detalhes: e.message });
  }
});

// DELETE - remover placar
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('placares').doc(id).delete();
    res.json({ mensagem: 'Placar removido com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover placar', detalhes: e.message });
  }
});

module.exports = router;
