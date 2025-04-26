import React, { useState } from "react";
import LiveStatus from "./LiveStatus.jsx";
import Message from "./Message.jsx";
import { getTopFan } from "./topfan-util";
import { getFrasesProntas } from "./torcida-bot";
export default function MainChat({ user, messages, handleSend, msg, setMsg, handleLogout, topFan, loading, liveStatus, handleGoogleLogin, handleAnonLogin }) {
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
              {showLogoutModal && (
                <div className="furia-modal-overlay" tabIndex={0} aria-modal="true" role="dialog">
                  <div className="furia-modal">
                    <p>Tem certeza que deseja sair do chat?</p>
                    <div className="furia-modal-btns">
                      <button className="furia-btn" onClick={() => { setShowLogoutModal(false); handleLogout(); }}>Sim, sair</button>
                      <button className="furia-btn" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
                    </div>
                  </div>
                </div>
              )}
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
              {getFrasesProntas().map((frase, idx) => (
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
