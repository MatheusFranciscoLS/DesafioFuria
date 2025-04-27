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

const Joi = require('joi');
const { validateModalidade } = require('../utils/validators');

// GET placares (com filtro opcional por modalidade)
const { resolveModalidade } = require('../utils/modalidadeSynonyms');

/**
 * GET placares (com filtro opcional por modalidade)
 * Query params: modalidade, page, limit
 * @route GET /
 */
/**
 * GET placares
 * Retorna erro amigável se houver query inválida (ex: comandos reservados).
 * @route GET /
 */
router.get('/', async (req, res, next) => {
  const { modalidade, page = 1, limit = 20 } = req.query;
  if (modalidade) {
    const { error } = validateModalidade(modalidade);
    if (error) return res.status(400).json({ erro: 'Modalidade inválida' });
  }
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  try {
    // Tratamento para comandos reservados como query
    const { comando } = req.query;
    if (comando === 'help' || comando === 'comandos') {
      return res.status(400).json({ erro: 'Consulta inválida. Veja os comandos disponíveis em /help.' });
    }
    let query = db.collection('placares');
    if (modalidade) {
      const modKey = resolveModalidade(modalidade);
      query = query.where('modalidade', '==', modKey);
    }
    const snapshot = await query.get();
    let placares = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Paginação manual
    const start = (pageNum - 1) * limitNum;
    placares = placares.slice(start, start + limitNum);
    res.json({ placares, page: pageNum, limit: limitNum });
  } catch (e) {
    next(e);
  }
});

// POST - adicionar placar
/**
 * POST - adicionar placar
 * @route POST /
 * @access Authenticated
 */
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
/**
 * PUT - atualizar placar
 * @route PUT /:id
 * @access Authenticated
 */
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
/**
 * DELETE - remover placar
 * @route DELETE /:id
 * @access Authenticated
 */
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
