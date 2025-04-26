// src/components/Quiz.jsx
// Quiz FURIA: perguntas e respostas sobre o time
import React, { useState } from 'react';

const QUESTIONS = [
  {
    question: 'Em que ano a FURIA foi fundada?',
    options: ['2015', '2017', '2018', '2019'],
    answer: '2017',
    explanation: 'A FURIA foi fundada em agosto de 2017.'
  },
  {
    question: 'Qual é o animal símbolo da FURIA?',
    options: ['Leão', 'Pantera', 'Lobo', 'Tigre'],
    answer: 'Pantera',
    explanation: 'A pantera representa a agressividade e garra da FURIA.'
  },
  {
    question: 'Quem é o IGL (In-Game Leader) do time de CS:GO?',
    options: ['KSCERATO', 'yuurih', 'arT', 'drop'],
    answer: 'arT',
    explanation: 'arT é conhecido por seu estilo agressivo como IGL.'
  },
  {
    question: 'Qual jogador é famoso pelos "rushes" agressivos?',
    options: ['FalleN', 'arT', 'KSCERATO', 'chelo'],
    answer: 'arT',
    explanation: 'arT ficou conhecido mundialmente por suas táticas de rush agressivo.'
  },
  {
    question: 'Qual título internacional a FURIA conquistou em 2019?',
    options: ['ESL Pro League', 'DreamHack Masters', 'ECS Season 7', 'BLAST Premier'],
    answer: 'ECS Season 7',
    explanation: 'A FURIA foi vice-campeã da ECS Season 7 em 2019.'
  },
  {
    question: 'Quem é o coach lendário da FURIA?',
    options: ['guerri', 'zews', 'peacemaker', 'Apoka'],
    answer: 'guerri',
    explanation: 'guerri é o coach e símbolo da mentalidade FURIA.'
  },
  {
    question: 'Qual destes jogadores NÃO faz parte do elenco principal da FURIA em 2025?',
    options: ['KSCERATO', 'yuurih', 'chelo', 'coldzera'],
    answer: 'coldzera',
    explanation: 'coldzera nunca jogou pela FURIA.'
  },
  {
    question: 'Qual streamer/pro player ficou famoso pelo bordão "FURIA neles!"?',
    options: ['Gaules', 'FalleN', 'yuurih', 'Fer'],
    answer: 'Gaules',
    explanation: 'O streamer Gaules popularizou o bordão "FURIA neles!".'
  },
  {
    question: 'Qual o maior feito internacional da FURIA até 2024?',
    options: ['Top 3 HLTV', 'Campeã Major', 'Top 8 Katowice', 'MVP ESL One'],
    answer: 'Top 3 HLTV',
    explanation: 'A FURIA chegou ao Top 3 do ranking mundial da HLTV em 2019.'
  },
  {
    question: 'Qual destes é um meme clássico da torcida FURIA?',
    options: ['Rush B', 'Pantera nervosa', 'Vamos jogar safe', 'AWP do FalleN'],
    answer: 'Pantera nervosa',
    explanation: 'O meme "pantera nervosa" é muito usado entre torcedores da FURIA.'
  }
];

const Quiz = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);

  const handleOption = (option) => {
    if (selected) return; // Prevent double answer
    setSelected(option);
    if (option === QUESTIONS[step].answer) setScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      if (step + 1 < QUESTIONS.length) setStep(s => s + 1);
      else setShowResult(true);
    }, 1200);
  };

  // Ao fechar, envie score e total para o callback do Chatbot
  const handleClose = async () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      if (typeof onClose === 'function') onClose(score, QUESTIONS.length);
    }, 1000);
  };

  return (
    <div className="quiz-modal" tabIndex={0} aria-label="Quiz FURIA">
      <button className="quiz-close" onClick={handleClose} aria-label="Fechar quiz">×</button>
      {!showResult ? (
        <div className="quiz-question">
          <h2 style={{display:'flex',alignItems:'center',gap:10}}>
            <span role="img" aria-label="Pantera FURIA" style={{fontSize:28}}>🐆</span>
            {QUESTIONS[step].question}
          </h2>
          <div className="quiz-options">
            {QUESTIONS[step].options.map(option => (
              <button
                key={option}
                className={`quiz-option${selected === option ? ' selected' : ''}`}
                onClick={() => handleOption(option)}
                disabled={!!selected}
                aria-label={`Escolher opção ${option}`}
                style={{
                  opacity: selected && selected !== option ? 0.5 : 1,
                  cursor: selected ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.3s'
                }}
              >
                {option}
                {selected === option && (
                  <span style={{ marginLeft: 8, fontSize: 15 }} aria-label="Processando resposta">
                    <svg width="18" height="18" viewBox="0 0 50 50" style={{ verticalAlign: 'middle', marginLeft: 2 }}>
                      <circle cx="25" cy="25" r="20" fill="none" stroke="#f9d923" strokeWidth="5" strokeDasharray="31.4 31.4" strokeLinecap="round">
                        <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.7s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
          {selected && (
            <div className="quiz-explanation">
              {selected === QUESTIONS[step].answer ? '✔️ Correto!' : '❌ Errado!'}<br />
              <span>{QUESTIONS[step].explanation}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="quiz-result">
          <h2>Quiz finalizado!</h2>
          <p>Pontuação: <b>{score}</b> de {QUESTIONS.length}</p>
          <button onClick={handleClose} disabled={closing} style={{
            background: '#f9d923',
            color: '#181818',
            fontWeight: 900,
            border: 'none',
            borderRadius: 8,
            fontSize: 17,
            padding: '10px 0',
            cursor: closing ? 'not-allowed' : 'pointer',
            opacity: closing ? 0.7 : 1,
            minWidth: 110
          }}>
            {closing ? 'Fechando...' : 'Fechar'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
