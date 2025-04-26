import React from 'react';
import Leaderboard from './Leaderboard';
import styles from './FanRanking.module.css';

export default function FanRanking() {
  const [open, setOpen] = React.useState(false);
  return (
    <section className={styles.fanRankingSection}>
      <h2 className={styles.title}>🏆 Ranking dos Fãs</h2>
      <p className={styles.subtitle}>Veja quem são os maiores torcedores da FURIA! Interaja no chat para subir no ranking.</p>
      <button className={styles.openBtn} onClick={() => setOpen(true)}>
        Ver Ranking Completo
      </button>
      {open && <Leaderboard onClose={() => setOpen(false)} />}
    </section>
  );
}
