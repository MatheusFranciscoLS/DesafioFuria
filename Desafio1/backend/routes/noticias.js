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

// GET notícias (com filtro opcional por modalidade)
router.get('/', async (req, res) => {
  const { modalidade } = req.query;
  try {
    let query = db.collection('noticias');
    if (modalidade) {
      query = query.where('modalidade', '==', modalidade.toLowerCase());
    }
    const snapshot = await query.get();
    const noticias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ noticias });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar notícias', detalhes: e.message });
  }
});

// POST - adicionar notícia
router.post('/', authenticate, async (req, res) => {
  const { modalidade, titulo, data, texto } = req.body;
  if (!modalidade || !titulo || !data || !texto) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade, titulo, data, texto' });
  }
  try {
    const docRef = await db.collection('noticias').add({ modalidade: modalidade.toLowerCase(), titulo, data, texto });
    res.status(201).json({ mensagem: 'Notícia adicionada', id: docRef.id });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao adicionar notícia', detalhes: e.message });
  }
});

// PUT - atualizar notícia
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { modalidade, titulo, data, texto } = req.body;
  if (!modalidade || !titulo || !data || !texto) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade, titulo, data, texto' });
  }
  try {
    await db.collection('noticias').doc(id).update({ modalidade: modalidade.toLowerCase(), titulo, data, texto });
    res.json({ mensagem: 'Notícia atualizada com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar notícia', detalhes: e.message });
  }
});

// DELETE - remover notícia
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('noticias').doc(id).delete();
    res.json({ mensagem: 'Notícia removida com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover notícia', detalhes: e.message });
  }
});

module.exports = router;
