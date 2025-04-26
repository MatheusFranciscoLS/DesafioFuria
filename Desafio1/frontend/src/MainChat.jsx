import React, { useState } from "react";
import LiveStatus from "./LiveStatus.jsx";
import Message from "./Message.jsx";
import { getTopFan } from "./topfan-util";
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
function isCommandSuggestion(s) {
  return /^\//.test(s);
}

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

export default function MainChat({ user, messages, handleSend, msg, setMsg, handleLogout, topFan, loading, liveStatus, handleGoogleLogin, handleAnonLogin, channel, modalidade, setModalidade }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sendBounce, setSendBounce] = useState(false);

  function handleSendWithBounce(e) {
    if (handleSend) handleSend(e);
    setSendBounce(true);
    setTimeout(() => setSendBounce(false), 300);
  }

  return (
    <main className="furia-mainchat">
      <LiveStatus status={liveStatus} />
      <div className="furia-card" id="chatbox" style={{ minHeight: 320, maxHeight: 360, overflowY: 'auto', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <span style={{ color: '#FFD600', fontSize: '1.1rem', width: '100%', textAlign: 'center' }}>Carregando...</span>
        ) : !user ? (
          <div style={{ color: '#FFD600', textAlign: 'center', width: '100%', fontSize: '1.13rem', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div>Faça login para visualizar as mensagens do chat!</div>
            <button onClick={handleGoogleLogin} className="furia-btn" style={{ marginTop: 8 }}>Entrar com Google</button>
            <button onClick={handleAnonLogin} className="furia-btn">Entrar como Anônimo</button>
          </div>
        ) : (
          <div className="furia-messages-list">
            {messages.map((m, idx) => (
              <Message
                key={m.id || idx}
                m={m}
                isOwn={user && m.uid === user.uid}
                topFan={topFan}
              />
            ))}
          </div>
        )}
      </div>
      {user ? (
        <div>
          {/* Sugestões automáticas para #bot-ajuda */}
          {window.location.hash === '#bot-ajuda' && (
            <BotAjudaModalidadesWrapper msg={msg} setMsg={setMsg} user={user} modalidade={modalidade} setModalidade={setModalidade} />
          )}
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
              />
              <button className={`furia-send-btn${sendBounce ? ' bounceSend' : ''}`} type="submit" aria-label="Enviar mensagem" tabIndex={0}>
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
          </div>
        </div>
      ) : null}
    </main>
  );
}
