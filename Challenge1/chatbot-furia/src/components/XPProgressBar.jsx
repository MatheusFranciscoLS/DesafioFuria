import React from 'react';
import styles from './XPProgressBar.module.css';

// Tabela de XP por nível
const LEVELS = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 500 },
  { level: 5, xp: 1000 },
  // Adicione mais níveis conforme necessário
];

function getLevelFromXP(xp) {
  let level = 1;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) {
      level = LEVELS[i].level;
      break;
    }
  }
  return level;
}

function getNextLevelXP(level) {
  const currentIdx = LEVELS.findIndex(l => l.level === level);
  if (currentIdx === -1 || currentIdx === LEVELS.length - 1) return null;
  return LEVELS[currentIdx + 1].xp;
}

export default function XPProgressBar({ xp, badges = [] }) {
  const currentLevel = getLevelFromXP(xp);
  const nextLevelXP = getNextLevelXP(currentLevel);
  const prevLevelXP = LEVELS.find(l => l.level === currentLevel)?.xp || 0;
  let progress = 100;
  let xpToNext = null;
  if (typeof xp === 'number' && typeof prevLevelXP === 'number' && nextLevelXP) {
    progress = ((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
    xpToNext = nextLevelXP - xp;
    if (xpToNext < 0) xpToNext = 0;
    if (progress < 0) progress = 0;
    if (progress > 100) progress = 100;
  }

  return (
    <>
      <div className={styles.progressBarContainer}>
        <div className={styles.levelInfo}>
          <span>Nível {currentLevel}</span>
          <span>{typeof xp === 'number' && typeof prevLevelXP === 'number' && nextLevelXP ? `${xp - prevLevelXP}/${nextLevelXP - prevLevelXP}` : xp}{nextLevelXP ? ' XP' : '+'}</span>
          {badges.length > 0 && (
            <span style={{ marginLeft: 10, fontSize: 18 }} title={`Badge: ${badges[badges.length - 1]}`}>🏅</span>
          )}
        </div>
        <div className={styles.progressBarBG}>
          <div
            className={styles.progressBarFG}
            style={{ width: `${progress}%` }}
          />
        </div>
        {nextLevelXP ? (
          <div className={styles.nextLevelInfo}>
            Faltam {xpToNext} XP para o próximo nível
          </div>
        ) : currentLevel === LEVELS[LEVELS.length - 1].level ? (
          <div className={styles.nextLevelInfo}>
            Nível máximo atingido!
          </div>
        ) : null}
      </div>
      <style>{`
        @media (max-width: 500px) {
          .${styles.progressBarContainer} { padding: 6px 2px; }
          .${styles.levelInfo} { font-size: 14px; }
          .${styles.nextLevelInfo} { font-size: 12px; }
        }
      `}</style>
    </>
  );
}

