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

// GET jogos (com filtro opcional por modalidade)
router.get('/', async (req, res) => {
  const { modalidade } = req.query;
  try {
    let query = db.collection('jogos');
    if (modalidade) {
      query = query.where('modalidade', '==', modalidade.toLowerCase());
    }
    const snapshot = await query.get();
    const jogos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ jogos });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar jogos', detalhes: e.message });
  }
});

// POST - adicionar jogo
router.post('/', authenticate, async (req, res) => {
  const { modalidade, adversario, data, hora, torneio } = req.body;
  if (!modalidade || !adversario || !data || !hora || !torneio) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade, adversario, data, hora, torneio' });
  }
  try {
    const docRef = await db.collection('jogos').add({ modalidade: modalidade.toLowerCase(), adversario, data, hora, torneio });
    res.status(201).json({ mensagem: 'Jogo adicionado', id: docRef.id });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao adicionar jogo', detalhes: e.message });
  }
});

// PUT - atualizar jogo
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { modalidade, adversario, data, hora, torneio } = req.body;
  if (!modalidade || !adversario || !data || !hora || !torneio) {
    return res.status(400).json({ erro: 'Campos obrigatórios: modalidade, adversario, data, hora, torneio' });
  }
  try {
    await db.collection('jogos').doc(id).update({ modalidade: modalidade.toLowerCase(), adversario, data, hora, torneio });
    res.json({ mensagem: 'Jogo atualizado com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao atualizar jogo', detalhes: e.message });
  }
});

// DELETE - remover jogo
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('jogos').doc(id).delete();
    res.json({ mensagem: 'Jogo removido com sucesso' });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao remover jogo', detalhes: e.message });
  }
});

module.exports = router;
