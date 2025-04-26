import React from 'react';
import Quiz from './Quiz';
import styles from './QuizFuria.module.css';

export default function QuizFuria() {
  const [open, setOpen] = React.useState(false);
  return (
    <section className={styles.quizSection}>
      <h2 className={styles.title}>❓ Quiz da FURIA</h2>
      <p className={styles.subtitle}>Teste seus conhecimentos sobre a FURIA e conquiste XP!</p>
      <button className={styles.openBtn} onClick={() => setOpen(true)}>
        Iniciar Quiz
      </button>
      {open && <Quiz onClose={() => setOpen(false)} />}
    </section>
  );
}
