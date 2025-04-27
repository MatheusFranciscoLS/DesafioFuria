import React, { useState, useEffect } from "react";
import LiveStatus from "./LiveStatus.jsx";
import Message from "./Message.jsx";
import QuizEnqueteModal from "./QuizEnqueteModal.jsx";
import { quizPerguntas } from "./QuizData";
import { enquete } from "./EnqueteData";

import { getFrasesProntas, getFrasesProntasPorModalidade } from "./torcida-bot";
import { botFaqSuggestions } from "./bot-faq-suggestions";
import FuriaModal from "./FuriaModal.jsx";
import {
  saveUserFaqHistory,
  getUserFaqHistory,
  filterFaqSuggestions,
  getPopularFaqTopics,
  getFaqTooltip
} from "./bot-ajuda-utils";
import { furiaNews } from "./bot-news";
import { furiaModalidades } from "./furia-modalidades";

/**
 * MainChat.jsx - Componente principal do chat da FURIA
 * Gerencia exibição das mensagens, envio, sugestões, banner WhatsApp, e integração com Firestore.
 * Contém subcomponentes para barra de notícias, sugestões de bot, e seleção de modalidade.
 */

/**
 * Verifica se uma sugestão é um comando do bot (inicia com '/')
 * @param {string} s - Sugestão de texto
 * @returns {boolean} True se for comando
 */
function isCommandSuggestion(s) {
  return /^\//.test(s);
}

/**
 * Barra de notícias filtrada pela modalidade selecionada
 * @param {string} modalidade - Modalidade selecionada
 * @returns {JSX.Element|null} Barra de notícias ou null
 */
function FuriaNewsBar({ modalidade }) {
  let filtered = furiaNews;
  if (modalidade && modalidade !== 'all') {
    filtered = furiaNews.filter(n => !n.modalidade || n.modalidade === modalidade);
  }
  const news = filtered[0];
  if (!news) return null;
  return (
    <div className="furia-news-bar" style={{
      background: '#181A20',
      border: '2px solid #FFD600',
      borderRadius: 10,
      marginBottom: 10,
      marginTop: 2,
      padding: '10px 16px',
      color: '#FFD600',
      fontWeight: 600,
      boxShadow: '0 2px 12px #FFD60022, 0 1.5px 6px #0008',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      animation: 'fadeInModal 0.28s',
      maxWidth: '100%'
    }}>
      <span style={{fontSize: '1.07em'}}>
        <span role="img" aria-label="Notícia">📰</span> Novidade FURIA GG: <strong>{news.title}</strong>
        {news.modalidade && news.modalidade !== 'all' && (
          <span style={{marginLeft:8, fontSize:'0.93em', color:'#FFD600bb', fontWeight:400}}>
            [{furiaModalidades.find(m=>m.key===news.modalidade)?.label || news.modalidade}]
          </span>
        )}
      </span>
      <span style={{fontSize: '0.97em', color: '#fff', marginTop: 2, marginBottom: 2}}>{news.content}</span>
      <a href={news.link} target="_blank" rel="noopener noreferrer" style={{color: '#FFD600', textDecoration: 'underline', fontWeight: 500, fontSize: '0.98em', marginTop: 2}}>Ler mais no site oficial</a>
    </div>
  );
}

/**
 * Wrapper para seleção de modalidade e sugestões do bot-ajuda
 * @param {string} msg - Mensagem atual
 * @param {function} setMsg - Setter de mensagem
 * @param {object} user - Usuário logado
 * @returns {JSX.Element} Wrapper de sugestões/modalidades
 */
function BotAjudaModalidadesWrapper({ msg, setMsg, user }) {
  const [modalidade, setModalidade] = React.useState('all');
  return (
    <>
      <div className="furia-modalidades-bar" style={{display:'flex',gap:10,marginBottom:8,flexWrap:'wrap'}}>
        {furiaModalidades.map(m => (
          <button
            key={m.key}
            className={
              'furia-modalidade-btn' + (modalidade === m.key ? ' selected' : '')
            }
            style={{
              background: modalidade === m.key ? '#FFD600' : '#23242b',
              color: modalidade === m.key ? '#181A20' : '#fff',
              border: modalidade === m.key ? '2px solid #FFD600' : '2px solid #fff',
              borderRadius: 7,
              padding: '6px 13px',
              fontWeight: 600,
              fontSize: '0.98em',
              cursor: 'pointer',
              transition: 'background 0.13s, color 0.13s, border 0.13s',
              outline: 'none',
            }}
            onClick={() => setModalidade(m.key)}
            aria-label={`Filtrar por modalidade: ${m.label}`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <FuriaNewsBar modalidade={modalidade} />
      <BotAjudaBar
        msg={msg}
        setMsg={setMsg}
        user={user}
        modalidade={modalidade}
      />
    </>
  );
}

/**
 * Barra de sugestões automáticas para o canal #bot-ajuda
 * Inclui busca, histórico e sugestões baseadas na modalidade
 * @param {string} msg - Mensagem atual
 * @param {function} setMsg - Setter de mensagem
 * @param {object} user - Usuário logado
 * @param {string} modalidade - Modalidade selecionada
 * @returns {JSX.Element} Barra de sugestões
 */
function BotAjudaBar({ msg, setMsg, user, modalidade = 'all' }) {
  const [search, setSearch] = React.useState("");
  const [copiedIdx, setCopiedIdx] = React.useState(-1);
  const [autoSuggestions, setAutoSuggestions] = React.useState([]);
  const [showAuto, setShowAuto] = React.useState(false);
  const [focusIdx, setFocusIdx] = React.useState(-1);
  const [history, setHistory] = React.useState(getUserFaqHistory(user?.uid));
  const allSuggestions = React.useMemo(() => {
    let base = botFaqSuggestions;
    if (modalidade && modalidade !== 'all') {
      base = base.filter(s => !s.modalidade || s.modalidade === modalidade);
    }
    return filterFaqSuggestions(base, search);
  }, [search, modalidade]);
  const popular = React.useMemo(() => getPopularFaqTopics(), []);
  React.useEffect(() => { setHistory(getUserFaqHistory(user?.uid)); }, [user]);
  React.useEffect(() => {
    if (msg && msg.length > 1) {
      setAutoSuggestions(
        botFaqSuggestions.filter(s => s.toLowerCase().includes(msg.toLowerCase()) && s.toLowerCase() !== msg.toLowerCase())
      );
      setShowAuto(true);
    } else {
      setShowAuto(false);
    }
  }, [msg]);
  function handleCopy(s, idx) {
    setMsg(s);
    navigator.clipboard && navigator.clipboard.writeText && navigator.clipboard.writeText(s);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(-1), 1200);
    if (user?.uid) saveUserFaqHistory(user.uid, s);
    setHistory(getUserFaqHistory(user?.uid));
  }
  return (
    <section className="furia-bot-suggestions-bar" aria-label="Sugestões de perguntas para o bot" tabIndex={0}>
      <div className="furia-bot-suggestions-title">
        <span role="img" aria-label="Ajuda">💡</span> Precisa de inspiração? Pesquise ou clique para copiar uma sugestão:
      </div>
      <input
        className="furia-bot-suggestions-search"
        placeholder="Buscar sugestão..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Buscar sugestão"
      />
      {popular.length > 0 && !search && (
        <div className="furia-bot-suggestions-popular-title">Tópicos populares:</div>
      )}
      {popular.length > 0 && !search && (
        <div className="furia-bot-suggestions-popular">
          {popular.map((s, idx) => (
            <button
              key={s}
              className="furia-bot-popular-btn"
              onClick={() => handleCopy(s, idx)}
              tabIndex={0}
              aria-label={`Copiar tópico popular: ${s}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {history.length > 0 && (
        <div className="furia-bot-suggestions-history">Suas perguntas recentes:</div>
      )}
      {history.length > 0 && (
        <ul className="furia-bot-history-list">
          {history.map((h, idx) => (
            <li key={h.q + idx}>
              <button
                className="furia-bot-history-btn"
                onClick={() => handleCopy(h.q, idx)}
                tabIndex={0}
                aria-label={`Copiar pergunta recente: ${h.q}`}
              >
                {h.q}
              </button>
            </li>
          ))}
        </ul>
      )}
      <ul className="furia-bot-suggestions-list">
        {allSuggestions.map((s, idx) => (
          <li key={s} className="furia-bot-suggestion-item" style={{position:'relative'}}>
            <button
              type="button"
              className={
                "furia-suggestion-btn" +
                (copiedIdx === idx ? " copied" : "") +
                (isCommandSuggestion(s) ? " command" : "")
              }
              aria-label={`Copiar sugestão: ${s}`}
              tabIndex={0}
              onClick={() => handleCopy(s, idx)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCopy(s, idx); }}
              onMouseEnter={() => setFocusIdx(idx)}
              onFocus={() => setFocusIdx(idx)}
              onMouseLeave={() => setFocusIdx(-1)}
              onBlur={() => setFocusIdx(-1)}
            >
              {s}
              <span className="furia-suggestion-copy" aria-hidden="true">
                {copiedIdx === idx ? "✔️" : isCommandSuggestion(s) ? "/" : "📋"}
              </span>
              <span className="furia-suggestion-tooltip" role="tooltip" style={{display: focusIdx === idx ? 'block' : undefined}}>
                {getFaqTooltip(s)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {showAuto && autoSuggestions.length > 0 && (
        <div className="furia-bot-suggestions-popular-title" style={{marginTop:8}}>Sugestões baseadas no que você está digitando:</div>
      )}
      {showAuto && autoSuggestions.length > 0 && (
        <ul className="furia-bot-suggestions-list">
          {autoSuggestions.map((s, idx) => (
            <li key={s} className="furia-bot-suggestion-item">
              <button
                className="furia-suggestion-btn"
                onClick={() => handleCopy(s, idx+1000)}
                tabIndex={0}
                aria-label={`Copiar sugestão dinâmica: ${s}`}
              >
                {s}
                <span className="furia-suggestion-copy" aria-hidden="true">✨</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Componente principal do chat
 * Responsável por exibir mensagens, enviar novas, mostrar banner, status ao vivo, sugestões e ações rápidas.
 * @param {object} user - Usuário logado
 * @param {Array} messages - Lista de mensagens do chat
 * @param {function} handleSend - Função para enviar mensagem
 * @param {string} msg - Mensagem atual
 * @param {function} setMsg - Setter de mensagem
 * @param {function} handleLogout - Função para logout
 * @param {object} topFan - Usuário top fan
 * @param {boolean} loading - Estado de loading
 * @param {object} liveStatus - Status ao vivo
 * @param {function} handleGoogleLogin - Login Google
 * @param {function} handleAnonLogin - Login anônimo
 * @param {string} modalidade - Modalidade selecionada
 * @param {function} setModalidade - Setter de modalidade
 * @returns {JSX.Element} Chat principal renderizado
 */
export default function MainChat({ user, messages, handleSend, msg, setMsg, handleLogout, topFan, loading, liveStatus, handleGoogleLogin, handleAnonLogin, modalidade, setModalidade }) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showEnquete, setShowEnquete] = useState(false);
  // Estado local do quiz
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAcertos, setQuizAcertos] = useState(0);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState("");
  // Estado local da enquete
  const [enqueteVoto, setEnqueteVoto] = useState("");
  const [enqueteEnviado, setEnqueteEnviado] = useState(false);

  function QuizContent() {
    if (quizFinalizado) {
      return (
        <div style={{color:'#FFD600'}}>
          <b>Quiz finalizado!</b><br/>
          Você acertou {quizAcertos} de {quizPerguntas.length} perguntas.<br/>
          <button className="furia-btn" style={{marginTop:12}} onClick={()=>{
            setQuizIdx(0); setQuizAcertos(0); setQuizFinalizado(false); setQuizFeedback(""); setShowQuiz(false);
          }}>Fechar</button>
        </div>
      );
    }
    const q = quizPerguntas[quizIdx];
    return (
      <div>
        <div style={{fontWeight:600,marginBottom:8}}>{q.pergunta}</div>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {q.opcoes.map((op,i)=>(
            <button key={i} className="furia-btn" style={{background:'#23242b',color:'#FFD600',border:'1.5px solid #FFD600',borderRadius:7,padding:'7px 10px',fontWeight:600,fontSize:'1em'}}
              onClick={()=>{
                if (quizFeedback) return;
                if (op[0]===q.resposta) {
                  setQuizAcertos(a=>a+1);
                  setQuizFeedback('Acertou! 🎉 '+q.explicacao);
                } else {
                  setQuizFeedback('Errou! 😅 '+q.explicacao);
                }
                setTimeout(()=>{
                  setQuizFeedback("");
                  if (quizIdx+1<quizPerguntas.length) setQuizIdx(i=>i+1);
                  else setQuizFinalizado(true);
                }, 1200);
              }}>{op}</button>
          ))}
        </div>
        {quizFeedback && <div style={{marginTop:12,fontWeight:600}}>{quizFeedback}</div>}
      </div>
    );
  }

  function EnqueteContent() {
    if (enqueteEnviado) {
      return <div style={{color:'#FFD600'}}><b>Voto registrado!</b><br/>Obrigado por participar da enquete.<br/><button className="furia-btn" style={{marginTop:12}} onClick={()=>{setEnqueteVoto("");setEnqueteEnviado(false);setShowEnquete(false);}}>Fechar</button></div>;
    }
    return (
      <div>
        <div style={{fontWeight:600,marginBottom:8}}>{enquete.pergunta}</div>
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {enquete.opcoes.map((op,i)=>(
            <button key={i} className="furia-btn" style={{background:enqueteVoto===op?'#FFD600':'#23242b',color:enqueteVoto===op?'#181A20':'#FFD600',border:'1.5px solid #FFD600',borderRadius:7,padding:'7px 10px',fontWeight:600,fontSize:'1em'}}
              onClick={()=>setEnqueteVoto(op)}>{op}</button>
          ))}
        </div>
        <button className="furia-btn" style={{marginTop:14,background:'#FFD600',color:'#181A20',fontWeight:700,borderRadius:8,padding:'7px 18px',border:'2px solid #FFD600',fontSize:'1em'}}
          disabled={!enqueteVoto} onClick={()=>setEnqueteEnviado(true)}>
          Enviar voto
        </button>
      </div>
    );
  }
  // Banner Whatsapp FURIA
  const whatsappBanner = (
    <div style={{
      background: 'linear-gradient(90deg,#181A20 70%,#25D366 100%)',
      color: '#fff',
      borderRadius: 10,
      padding: '10px 18px',
      margin: '0px 7px 14px auto',
      maxWidth: 590,
      boxShadow: '0 2px 12px #25D36622, 0 1.5px 6px #0008',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      fontWeight: 500,
      fontSize: '1.08em',
      border: '2px solid #25D366',
      justifyContent: 'center'
    }}>
      <span style={{fontSize:'1.28em',marginRight:8}}>💬</span>
      Referência do Contato Inteligente da FURIA no WhatsApp (closed beta):
      <a href="https://wa.me/5511993404466" target="_blank" rel="noopener noreferrer" style={{
        marginLeft: 12,
        color: '#25D366',
        background: '#fff',
        borderRadius: 5,
        padding: '2px 10px',
        fontWeight: 700,
        textDecoration: 'none',
        fontSize: '1.04em',
        boxShadow: '0 1px 6px #25D36622',
        transition: 'background 0.15s, color 0.15s',
        border: '1.5px solid #25D366'
      }}>Abrir WhatsApp</a>
    </div>
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sendBounce, setSendBounce] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroChat, setErroChat] = useState("");
  const chatEndRef = React.useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  async function handleSendWithBounce(e) {
    e.preventDefault();
    setErroChat("");
    // Filtro de palavras proibidas
    const palavrasProibidas = ["palavrão1","palavrão2","idiota","burro","otário","merda","bosta","fdp","pqp","caralho","puta","porra","desgraça","maldito","maldita"];
    if (msg && palavrasProibidas.some(p => msg.toLowerCase().includes(p))) {
      setErroChat("Sua mensagem contém palavras inadequadas. Por favor, seja respeitoso!");
      return;
    }
    setEnviando(true);
    try {
      if (handleSend) await handleSend(e);
      setSendBounce(true);
      setTimeout(() => setSendBounce(false), 300);
    } catch { 
      setErroChat("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="furia-mainchat">
      {whatsappBanner}
      <LiveStatus status={liveStatus} />
      <div className="furia-card" id="chatbox" style={{ minHeight: 320, maxHeight: 360, overflowY: 'auto', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <div className="furia-skeleton-loader" style={{width:'100%',height:180,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div className="furia-skeleton-msg" style={{width:'80%',height:24,background:'#FFD60022',borderRadius:6,marginBottom:10}}></div>
            <div className="furia-skeleton-msg" style={{width:'60%',height:24,background:'#FFD60022',borderRadius:6}}></div>
          </div>
        ) : !user ? (
          <div style={{ color: '#FFD600', textAlign: 'center', width: '100%', fontSize: '1.13rem', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div>Faça login para visualizar as mensagens do chat!</div>
            <button onClick={handleGoogleLogin} className="furia-btn" style={{ marginTop: 8 }}>Entrar com Google</button>
            <button onClick={handleAnonLogin} className="furia-btn">Entrar como Anônimo</button>
          </div>
        ) : (
          <div className="furia-messages-list">
            {messages.map((m, idx) => (
              <div key={m.id || idx} style={{position:'relative'}}>
                <Message
                  m={m}
                  isOwn={user && m.uid === user.uid}
                  topFan={topFan}
                />

              </div>
            ))}
          </div>
        )}
      </div>
      {user ? (
        <div>
          {erroChat && <div style={{color:'#FFD600',background:'#23242b',padding:'7px 14px',borderRadius:8,marginBottom:8,fontWeight:600}}>{erroChat}</div>}
          {/* Sugestões automáticas para #bot-ajuda */}
          {window.location.hash === '#bot-ajuda' && (
            <BotAjudaModalidadesWrapper msg={msg} setMsg={setMsg} user={user} modalidade={modalidade} setModalidade={setModalidade} />
          )}
          {/* Botões de acesso rápido para Quiz e Enquete */}
          <div style={{display:'flex',gap:12,marginBottom:14}}>
            <button type="button" className="furia-btn" style={{background:'#FFD600',color:'#181A20',fontWeight:700,borderRadius:8,padding:'7px 18px',border:'2px solid #FFD600',fontSize:'1em',boxShadow:'0 1px 6px #FFD60033'}} onClick={()=>setShowQuiz(true)}>
              🧠 Iniciar Quiz
            </button>
            <button type="button" className="furia-btn" style={{background:'#FFD600',color:'#181A20',fontWeight:700,borderRadius:8,padding:'7px 18px',border:'2px solid #FFD600',fontSize:'1em',boxShadow:'0 1px 6px #FFD60033'}} onClick={()=>setShowEnquete(true)}>
              📊 Responder Enquete
            </button>
          </div>
          <QuizEnqueteModal open={showQuiz} onClose={()=>setShowQuiz(false)} title="Quiz FURIA">
            <QuizContent />
          </QuizEnqueteModal>
          <QuizEnqueteModal open={showEnquete} onClose={()=>setShowEnquete(false)} title="Enquete FURIA">
            <EnqueteContent />
          </QuizEnqueteModal>
          <div className="furia-chat-box-wrap">
            <form className="furia-chat-form" onSubmit={handleSendWithBounce}>
              <input
                className="furia-chat-input"
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder="Mande sua mensagem para a FURIA..."
                maxLength={300}
                autoFocus
                tabIndex={0}
                aria-label="Digite sua mensagem"
                disabled={enviando}
              />
              <button className={`furia-send-btn${sendBounce ? ' bounceSend' : ''}`} type="submit" aria-label="Enviar mensagem" tabIndex={0} disabled={enviando}>
                {enviando ? <span className="furia-send-spinner" style={{marginRight:6,verticalAlign:'middle',display:'inline-block',width:16,height:16,border:'2px solid #FFD600',borderTop:'2px solid transparent',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}></span> : null}
                Enviar
              </button>
              <button
                type="button"
                className="furia-btn"
                style={{ background: '#23242b', color: '#FFD600', border: '1px solid #FFD600', marginLeft: 10 }}
                aria-label="Sair do chat"
                tabIndex={0}
                onClick={() => setShowLogoutModal(true)}
              >
                Sair
              </button>
              <FuriaModal
  open={showLogoutModal}
  onClose={() => setShowLogoutModal(false)}
  onConfirm={() => { setShowLogoutModal(false); handleLogout(); }}
  message="Tem certeza que deseja sair do chat?"
/>
            </form>
          </div>
          {/* Barra de ações rápidas: emojis + frases */}
          <div className="furia-quick-actions-bar">
            <div className="furia-stickers-bar">
              {['🔥', '🐾', '😎', '🏆', '🦁'].map((sticker, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="furia-sticker-btn"
                  onClick={() => setMsg(msg + sticker)}
                  aria-label={`Adicionar ${sticker}`}
                >
                  {sticker}
                </button>
              ))}
            </div>
            <div className="furia-frases-bot-bar">
              {(typeof getFrasesProntasPorModalidade === 'function' ? getFrasesProntasPorModalidade(modalidade || 'all') : getFrasesProntas()).map((frase, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="furia-frase-btn"
                  onClick={() => setMsg(frase)}
                >
                  {frase}
                </button>
              ))}
            </div>
            <div ref={chatEndRef}></div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
