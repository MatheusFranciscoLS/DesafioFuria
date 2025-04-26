import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import styles from "./Chatbot.module.css";
import XPProgressBar from "./XPProgressBar";
import MascotSelector from "./MascotSelector";
import SocialShare from "./SocialShare";
import Notification from "./Notification";
import Quiz from "./Quiz";

import Confetti from "./Confetti";
import { playSend, playReceive } from "./sound";


// Utilitário para formatar hora
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}


// Modal genérico reutilizável
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} tabIndex={-1}>
      <div
        className={styles.modal}
        ref={modalRef}
        tabIndex={0}
        aria-modal="true"
        role="dialog"
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar modal">×</button>
        <h2 className={styles.modalTitle}>{title}</h2>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
}

// Sugestões de respostas rápidas
function Suggestions({ suggestions, onSelect, disabled }) {
  return (
    <div className={styles.suggestions} aria-label="Sugestões">
      {suggestions.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className={styles.suggestionBtn}
          disabled={disabled}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

// Componente principal do Chatbot
// Renderização básica de markdown para respostas do bot
function renderMarkdown(text) {
  if (!text) return '';
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // bold
    .replace(/\*(.*?)\*/g, '<i>$1</i>') // italic
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>') // links
    .replace(/\n/g, '<br/>'); // line breaks
  return html;
}

export default function Chatbot() {
  // Estado de notificações
  const [notifs, setNotifs] = useState([]);
  const { user } = useUser();

  // Função para exibir notificação
  function showNotification({ type, message }) {
    const id = Math.random().toString(36).slice(2);
    setNotifs((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setNotifs((prev) => prev.filter(n => n.id !== id)), 4000);
  }

  // Todos os dados do usuário agora vêm do contexto global
  // Exemplo: user?.name, user?.avatar, user?.xp, user?.badges, user?.mascot

  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Olá, seja muito bem-vindo ao Chatbot FURIA! Aqui você pode tirar dúvidas, testar seus conhecimentos no quiz, acompanhar seu ranking e viver a torcida como nunca! Me diga: como posso tornar seu dia de fã mais especial hoje? 🖤💛", time: new Date(), avatar: "/logo-furia.png" },
  ]);
  const [input, setInput] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  // Sugestões contextuais e comandos rápidos
  const SUGGESTIONS = [
    { cmd: 'Me conta uma curiosidade da FURIA', label: 'Curiosidade' },
    { cmd: 'Quais as últimas notícias?', label: 'Notícias' },
    { cmd: 'Quando é o próximo jogo?', label: 'Próximo Jogo' },
    { cmd: 'O jogo está ao vivo?', label: 'Status Ao Vivo' },
    { cmd: 'Quem está no elenco?', label: 'Elenco' },
    { cmd: 'Quais as redes oficiais?', label: 'Redes Oficiais' },
    "Mostrar Quiz",
    "Ver Leaderboard",
    "Como funciona o XP?",
  ];
  const [suggestions, setSuggestions] = useState(SUGGESTIONS.map(s => typeof s === 'string' ? s : s.label));

  // Base de conhecimento temática FURIA
  const FURIA_TOPICS = [
    {
      keywords: ['curiosidade', 'fato', 'sabia', 'história'],
      responses: [
        'Você sabia? A FURIA foi o primeiro time brasileiro a chegar ao top 3 do ranking mundial da HLTV em 2019! 🐆',
        'Curiosidade: O nome FURIA vem da vontade de jogar sempre com intensidade máxima, sem medo! 💛🖤',
        'A FURIA tem uma das torcidas mais apaixonadas do cenário de CS:GO! #GoFURIA',
        'Dizem que o arT já rushou B mais de 1000 vezes só em 2024! 😂',
      ]
    },
    {
      keywords: ['notícia', 'novidade', 'aconteceu', 'news'],
      responses: [
        'Últimas da FURIA (abril/2025):\n- FURIA vence MIBR e avança nos playoffs da ESL Pro League\n- KSCERATO é eleito MVP do mês pela HLTV\n- FalleN comenta preparação para o Major: “Vamos com tudo!”',
        'Breaking news: FURIA vence clássico contra Imperial e segue viva no campeonato! 🏆',
        '• FURIA conquista vaga nos playoffs da ESL!\n• FalleN ultrapassa 250 mapas jogados pela FURIA.\n• Time faz bootcamp na Europa antes do Major.'
      ]
    },
    {
      keywords: ['próximo jogo', 'quando joga', 'agenda', 'jogo', 'partida', 'adversário'],
      responses: [
        'Próximo jogo: FURIA vs. NAVI — Domingo, 27/04/2025, às 16h (ESL Pro League). Assista ao vivo na Twitch da FURIA!',
        'Agenda: FURIA enfrenta a Imperial na próxima terça-feira, 29/04/2025, às 19h, valendo vaga na final!',
        'FURIA joga neste fim de semana! Fique ligado nas redes para o horário certinho!'
      ]
    },
    {
      keywords: ['elenco', 'line-up', 'jogadores', 'quem joga', 'time'],
      responses: [
        'Elenco atualizado (abril/2025):\n- KSCERATO\n- yuurih\n- chelo\n- FalleN\n- arT\nCoach: guerri',
        'Line-up FURIA 2025: FalleN (IGL), arT, KSCERATO, yuurih, chelo. Coach: guerri.',
        'Os brabos: KSCERATO, yuurih, chelo, FalleN, arT e o coach guerri!'
      ]
    },
    {
      keywords: ['status', 'ao vivo', 'live', 'placar', 'score', 'jogo está rolando'],
      responses: [
        '🔥 Jogo ao vivo: FURIA 12 x 10 NAVI (Mapa 2 - Mirage) | Última rodada: KSCERATO clutch 1v2! #GoFURIA',
        'Live: FURIA 8 x 7 Imperial (Mapa 1 - Nuke) | arT faz entry kill e torcida vai à loucura! 🐆',
        'Status ao vivo: FURIA 5 x 4 MIBR (Mapa 3 - Overpass) | yuurih lidera o scoreboard!'
      ]
    },
    {
      keywords: ['rede', 'instagram', 'twitter', 'twitch', 'social', 'contato'],
      responses: [
        'Siga a FURIA: Twitter: https://twitter.com/furiagg | Instagram: https://instagram.com/furiagg | Twitch: https://twitch.tv/furiagg',
        'Links oficiais: [Twitter](https://twitter.com/furiagg), [Instagram](https://instagram.com/furiagg), [Twitch](https://twitch.tv/furiagg)',
        'Quer acompanhar tudo? Segue a FURIA nas redes sociais e não perde nada!'
      ]
    },
    {
      keywords: ['obrigado', 'valeu', 'tmj', 'abraço', 'parabéns', 'show', 'massa'],
      responses: [
        'Tamo junto, fã! Aqui é FURIA! 👊',
        'Valeu demais, você é brabo(a)!',
        'É nóis! Sempre que quiser, chama no chat!'
      ]
    },
    {
      keywords: ['fallen', 'art', 'kscerato', 'yuurih', 'chelo', 'guerri'],
      responses: [
        'FalleN é o professor, liderando a FURIA rumo ao topo! 🧠',
        'arT é o rei do rush B! Já virou meme na torcida! 😂',
        'KSCERATO e yuurih são a dupla dinâmica do Brasil!',
        'chelo chegou pra somar e já conquistou a galera!',
        'guerri é o coach que faz a diferença!'
      ]
    },
  ];
  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function getConversationalResponse(message) {
    const msg = message.toLowerCase();
    for (const topic of FURIA_TOPICS) {
      if (topic.keywords.some((kw) => msg.includes(kw))) {
        return getRandom(topic.responses);
      }
    }
    // fallback para perguntas abertas
    if (msg.includes('oi') || msg.includes('olá') || msg.includes('salve')) {
      return getRandom([
        'Salve! Pronto pra torcer pela FURIA hoje?',
        'Fala, fã! Como posso te ajudar a acompanhar a FURIA?',
        'E aí! Bora conversar sobre o melhor time do Brasil?'
      ]);
    }
    if (msg.includes('quem é você') || msg.includes('sobre você')) {
      return 'Sou o bot oficial da FURIA, feito pra te deixar por dentro de tudo do time! Pode perguntar o que quiser.';
    }
    if (msg.includes('palpite') || msg.includes('vai ganhar')) {
      return 'Aqui é FURIA, sempre acredito na vitória! Mas CS é jogado, não é falado! 😎';
    }
    // resposta padrão descontraída
    return getRandom([
      'Não entendi muito bem, mas se for sobre a FURIA, pode perguntar de novo! 😅',
      'Pergunta de novo ou tenta de outro jeito, fã! Aqui é tudo nosso!',
      'FURIA neles! Se quiser saber de elenco, jogos, notícias ou curiosidades, é só perguntar!'
    ]);
  }
  const [selectedMascot, setSelectedMascot] = useState(user && (user?.mascot || '/logo-furia.png') ? (user?.mascot || '/logo-furia.png') : "/logo-furia.png");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll automático e botão de scroll
  useEffect(() => {
    if (!showScrollBtn) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [showScrollBtn, chatEndRef, messages, isBotTyping]);

  // Reset confetti visual após animação
  useEffect(() => {
    if (confetti) {
      const t = setTimeout(() => setConfetti(false), 1800);
      return () => clearTimeout(t);
    }
  }, [confetti]);

  // eslint-disable-next-line
  useEffect(() => {
    const onScroll = () => {
      const el = document.querySelector(`.${styles.chatWindow}`);
      if (!el) return;
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
    };
    const el = document.querySelector(`.${styles.chatWindow}`);
    if (el) el.addEventListener('scroll', onScroll);
    return () => el && el.removeEventListener('scroll', onScroll);
  }, []);

  // Foco automático
  useEffect(() => {
    if (!isBotTyping) inputRef.current?.focus();
  }, [isBotTyping, inputRef]);

  // Sugestões dinâmicas
  useEffect(() => {
    if (messages.length > 1) {
      if (messages[messages.length-1].text.toLowerCase().includes("xp")) {
        setSuggestions(["Como subir de nível?", "Quais badges existem?", "Mostrar Leaderboard"]);
      } else if (messages[messages.length-1].text.toLowerCase().includes("quiz")) {
        setSuggestions(["Quero outro quiz!", "Ver Leaderboard", "Como funciona o XP?"]);
      } else {
        setSuggestions(["Mostrar Quiz", "Ver Leaderboard", "Como funciona o XP?"]);
      }
    }
  }, [messages]);

  // Envio de mensagem
  // Envio de mensagem (resposta automática, sem IA)
  const handleSend = (text) => {
  if (!text.trim() || isBotTyping) return;
  playSend();
    if (!text.trim() || isBotTyping) return;
    const now = new Date();
    setMessages((msgs) => [
      ...msgs,
      { from: "bot", text: botMsg, time: new Date(), avatar: "/logo-furia.png" }
    ]);
    setIsBotTyping(false);
  }, 900);
};

// Sugestão rápida
const handleSuggestion = (s) => {
  setInput(s);
  handleSend(s);
};

// Mascote
const handleMascotSelect = (src) => {
  setSelectedMascot(src);
  showNotification({ type: 'achievement', message: 'Mascote atualizado! ' });
  setConfetti(true);
};

// Limpar chat com confirmação
const handleClear = () => {
  setConfirmClear(false);
  setMessages([{ from: "bot", text: "Chat limpo! Como posso ajudar?", time: new Date(), avatar: "/logo-furia.png" }]);
};

return (
  <div className={styles.chatbotContainer}>
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo-furia.png" alt="FURIA" height={38} style={{marginRight:8}} />
        FURIA Chatbot
      </div>
      <div className={styles.profile}>
        <img src={selectedMascot} alt="Avatar" className={styles.profileAvatar} />
        <span className={styles.profileName}>{(user?.name || 'Fã FURIA')}</span>
      </div>
    </header>
    <div className={styles.progressBarWrapper}>
      <XPProgressBar xp={(user?.xp || 0)} badges={(user?.badges || [])} />
    </div>
    <div className={styles.suggestionsBar}>
      <Suggestions suggestions={suggestions} onSelect={handleSuggestion} disabled={isBotTyping} />
      <button className={styles.clearBtn} onClick={() => setConfirmClear(true)} disabled={isBotTyping} aria-label="Limpar chat">Limpar Chat</button>
      {confirmClear && (
        <div className={styles.confirmClearModal} role="dialog" aria-modal="true" tabIndex={0}>
          <p>Tem certeza que deseja limpar o chat?</p>
          <button className={styles.primaryBtn} onClick={handleClear}>Sim, limpar</button>
          <button className={styles.secondaryBtn} onClick={()=>setConfirmClear(false)}>Cancelar</button>
        </div>
      )}
    </div>
    <div className={styles.chatWindow} aria-live="polite" style={{marginTop:8}}>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={msg.from === "bot" ? styles.botMsg : styles.userMsg + ' chatMsgAnim'}
          aria-label={msg.from === "bot" ? "Mensagem do bot" : "Sua mensagem"}
          tabIndex={0}
          style={{animation: 'fadeInUp 0.4s', display: 'flex', alignItems: 'flex-end'}}
        >
          <img src={msg.avatar} alt={msg.from === 'bot' ? 'Bot FURIA' : 'Você'} className={styles.msgAvatar + ' ' + (msg.from === 'bot' ? styles.botAvatar : styles.userAvatar)} />
          <div className={styles.msgBubble + ' ' + (msg.from === 'bot' ? styles.botMsgBubble : styles.userMsgBubble)}>
            <span className={styles.msgText} style={msg.from === 'bot' ? {color:'#f9d923', fontFamily:'Montserrat, Arial, sans-serif', fontWeight:600, letterSpacing:0.2} : {}}>
              {msg.from === 'bot' ? (
                <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
              ) : (
                msg.text
              )}
        {confirmClear && (
          <div className={styles.confirmClearModal} role="dialog" aria-modal="true" tabIndex={0}>
            <p>Tem certeza que deseja limpar o chat?</p>
            <button className={styles.primaryBtn} onClick={handleClear}>Sim, limpar</button>
            <button className={styles.secondaryBtn} onClick={()=>setConfirmClear(false)}>Cancelar</button>
          </div>
        )}
      </div>
      <div className={styles.chatWindow} aria-live="polite" style={{marginTop:8}}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.from === "bot" ? styles.botMsg : styles.userMsg + ' chatMsgAnim'}
            aria-label={msg.from === "bot" ? "Mensagem do bot" : "Sua mensagem"}
            tabIndex={0}
            style={{animation: 'fadeInUp 0.4s', display: 'flex', alignItems: 'flex-end'}}
          >
            <img src={msg.avatar} alt={msg.from === 'bot' ? 'Bot FURIA' : 'Você'} className={styles.msgAvatar + ' ' + (msg.from === 'bot' ? styles.botAvatar : styles.userAvatar)} />
            <div className={styles.msgBubble + ' ' + (msg.from === 'bot' ? styles.botMsgBubble : styles.userMsgBubble)}>
              <span className={styles.msgText} style={msg.from === 'bot' ? {color:'#f9d923', fontFamily:'Montserrat, Arial, sans-serif', fontWeight:600, letterSpacing:0.2} : {}}>
                {msg.from === 'bot' ? (
                  <span dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                ) : (
                  msg.text
                )}
              </span>
              <span className={styles.msgTime}>{formatTime(msg.time)}</span>
              {msg.from === 'bot' && (
                <button
                  className={styles.copyBtn}
                  aria-label="Copiar resposta do bot"
                  title="Copiar resposta do bot"
                  onClick={() => navigator.clipboard.writeText(msg.text)}
                  tabIndex={0}
                >
                  📋
                </button>
              )}
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className={styles.botMsg} style={{animation: 'fadeInUp 0.4s', display: 'flex', alignItems: 'flex-end'}}>
            <img src="/logo-furia.png" alt="Bot" className={styles.msgAvatar + ' ' + styles.botAvatar} />
            <div className={styles.msgBubble + ' ' + styles.botMsgBubble}>
              <span className={styles.typing} aria-live="polite" aria-label="Bot digitando">
                <span className={styles.typingDots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </span>
                <span style={{marginLeft:8, color:'#f9d923'}}>Digitando...</span>
              </span>
            </div>
          </div>
        )}
        {/* Indicação de usuário digitando (para UX, simulado) */}
        {input.length > 0 && !isBotTyping && (
          <div className={styles.userMsg} style={{animation: 'fadeInUp 0.4s', display: 'flex', alignItems: 'flex-end', opacity:0.7}}>
            <img src={(user?.avatar || '/logo-furia.png')} alt="Você" className={styles.msgAvatar + ' ' + styles.userAvatar} />
            <div className={styles.msgBubble + ' ' + styles.userMsgBubble}>
              <span className={styles.typing} aria-live="polite" aria-label="Você está digitando">
                <span className={styles.typingDots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </span>
                <span style={{marginLeft:8, color:'#fff'}}>Você está digitando...</span>
              </span>
      {/* Confetti visual para conquistas e quiz perfeito */}
      <div style={{ position: 'fixed', left: 0, right: 0, top: 24, zIndex: 4000, pointerEvents: 'none', display: 'flex', justifyContent: 'center' }}>
        <Confetti trigger={confetti} />
      </div>
      {/* Notificações visuais */}
      <div style={{ position: 'fixed', left: 0, right: 0, top: 0, zIndex: 3000, pointerEvents: 'none' }}>
        {notifs.map(n => (
          <Notification key={n.id} type={n.type} message={n.message} onClose={() => setNotifs(prev => prev.filter(x => x.id !== n.id))} />
        ))}
      </div>
      <form
        className={styles.inputArea}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        aria-label="Enviar mensagem"
      >
        <input
          className={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          aria-label="Mensagem"
          ref={inputRef}
          disabled={isBotTyping}
          aria-busy={isBotTyping}
        />
        <button className={styles.sendBtn} type="submit" aria-label="Enviar" disabled={isBotTyping}>➤</button>
      </form>
      {/* Modal Quiz com integração de XP/conquista/notificação */}
      <Modal isOpen={showQuiz} onClose={() => setShowQuiz(false)} title="Quiz FURIA">
        <Quiz onClose={(score, total) => {
          setShowQuiz(false);
          if (typeof score === 'number' && total) {
            // Dar XP e mostrar notificação de conquista
            // Atualize o XP do usuário via contexto global ou backend (exemplo: Firestore) se desejar persistência.
            showNotification({ type: 'success', message: `Você ganhou ${score * 50} XP no quiz!` });
            if (score === total) {
              showNotification({ type: 'achievement', message: 'Conquista desbloqueada: Mestre do Quiz!' });
              setConfetti(true);
              setTimeout(() => setConfetti(false), 3200);
            }
          }
        }} />
      </Modal>
      <Modal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} title="Leaderboard">
        <p>Veja quem está no topo do ranking FURIA!</p>
        <SocialShare user={(user?.name || 'Fã FURIA')} points={(user?.xp || 0)} />
        <button className={styles.primaryBtn} onClick={() => setShowLeaderboard(false)}>
          Fechar
        </button>
      </Modal>
      <div style={{margin:'18px 0 0 0', textAlign:'center'}}>
        <MascotSelector selected={selectedMascot} onSelect={handleMascotSelect} />
      </div>
    </div>
  );
}
