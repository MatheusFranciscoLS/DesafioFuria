// Componente de badges e conquistas para fãs
import React from "react";

const BADGES = [
  { id: 'estreante', name: 'Estreante', icon: '🔰', min: 1 },
  { id: 'torcedor', name: 'Torcedor', icon: '🐾', min: 5 },
  { id: 'apaixonado', name: 'Apaixonado', icon: '🔥', min: 15 },
  { id: 'lendario', name: 'Lendário', icon: '🏆', min: 40 },
  { id: 'mito', name: 'MITO', icon: '🦁', min: 100 },
];

export function getBadge(count) {
  let badge = BADGES[0];
  for (const b of BADGES) {
    if (count >= b.min) badge = b;
  }
  return badge;
}

export default function Badges({ count }) {
  const badge = getBadge(count);
  return (
    <span className="furia-badge" title={badge.name} style={{ marginLeft: 4, fontSize: '1.07em' }}>
      {badge.icon}
    </span>
  );
}
