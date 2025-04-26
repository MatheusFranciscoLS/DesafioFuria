import React from 'react';
import styles from './MascotSelector.module.css';

const mascots = [
  { name: 'Pantera', src: '/mascots/pantera.png' },
  { name: 'Leão', src: '/mascots/leao.png' },
  { name: 'Tigre', src: '/mascots/tigre.png' },
  { name: 'Lobo', src: '/mascots/lobo.png' },
];

export default function MascotSelector({ selected, onSelect }) {
  return (
    <div className={styles.mascotSelector}>
      {mascots.map(m => (
        <button
          key={m.name}
          className={selected === m.src ? styles.selected : ''}
          onClick={() => onSelect(m.src)}
          aria-label={`Selecionar mascote ${m.name}`}
        >
          <img src={m.src} alt={m.name} className={styles.mascotImg} />
        </button>
      ))}
    </div>
  );
}
