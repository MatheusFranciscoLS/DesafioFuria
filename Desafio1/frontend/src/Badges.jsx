// Componente de badges e conquistas para fãs
import React from "react";

const BADGES = [
  { id: 'estreante', name: 'Estreante', icon: '🔰', min: 1 },
  { id: 'torcedor', name: 'Torcedor', icon: '🐾', min: 5 },
  { id: 'apaixonado', name: 'Apaixonado', icon: '🔥', min: 15 },
  { id: 'lendario', name: 'Lendário', icon: '🏆', min: 40 },
  { id: 'mito', name: 'MITO', icon: '🦁', min: 100 },
];

/**
 * Retorna o badge correspondente ao número de mensagens do fã.
 * @param {number} count - Quantidade de mensagens
 * @returns {{id: string, name: string, icon: string, min: number}} Badge correspondente
 */
export function getBadge(count) {
  let badge = BADGES[0];
  for (const b of BADGES) {
    if (count >= b.min) badge = b;
  }
  return badge;
}

/**
 * Exibe o badge visual do fã de acordo com o número de mensagens.
 * @param {{ count: number }} props
 *   - count: quantidade de mensagens do fã
 * @returns {JSX.Element} Badge visual
 */
export default function Badges({ count }) {
  const badge = getBadge(count);
  return (
    <span className="furia-badge" title={badge.name} style={{ marginLeft: 4, fontSize: '1.07em' }}>
      {badge.icon}
    </span>
  );
}
