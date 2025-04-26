const Fuse = require('fuse.js');
const { modalidadeMap } = require('./modalidadeSynonyms');

const modalidades = Object.values(modalidadeMap).flat();
const fuse = new Fuse(modalidades, { threshold: 0.3 });

function fuzzySearchModalidade(query) {
  if (!query) return [];
  const result = fuse.search(query);
  return result.map(r => r.item);
}

module.exports = { fuzzySearchModalidade };
