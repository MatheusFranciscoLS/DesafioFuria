/**
 * fuzzyModalidade.js - Busca aproximada de modalidades usando Fuse.js para tolerância a erros de digitação.
 * Fornece função utilitária para encontrar modalidades mesmo com erros de digitação.
 */
const Fuse = require('fuse.js');
const { modalidadeMap } = require('./modalidadeSynonyms');

const modalidades = Object.values(modalidadeMap).flat();
const fuse = new Fuse(modalidades, { threshold: 0.3 });

/**
 * Busca modalidades aproximadas usando Fuse.js
 * @param {string} query - Texto da modalidade a ser buscada
 * @returns {string[]} Lista de modalidades encontradas
 */
function fuzzySearchModalidade(query) {
  if (!query) return [];
  const result = fuse.search(query);
  return result.map(r => r.item);
}

module.exports = { fuzzySearchModalidade };
