// src/components/Chatbot/MessageDisplay.jsx
// Exibe as mensagens do chat
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const MessageDisplay = ({ messages, isLoading, user }) => {
  const endRef = useRef(null);
  useEffect(() => {
    const container = endRef.current?.parentNode;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
    // Scroll da janela para o final da página
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="message-display" aria-live="polite" role="log">
      {messages.length === 0 && (
        <div className="no-messages">Nenhuma mensagem ainda.</div>
      )}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${message.sender}`}
          tabIndex={0}
          aria-label={`${message.sender === 'user' ? 'Usuário' : 'Bot'}: ${message.text}`}
          style={message.sender === 'user' && user ? { background: user.color, color: '#181818' } : {}}
        >
          {message.sender === 'bot' && (
            <img src="/avatars/avatar-bot.png" alt="Bot FURIA" className="avatar" />
          )}
          {message.sender === 'user' && user && (
            <>
              {console.log('Avatar do usuário na mensagem:', user.avatar)}
              <img src={user.avatar} alt="Seu avatar" className="avatar" />
            </>
          )}
          <span>{message.text}</span>
          {message.image && (
            <img src={message.image} alt="Mídia da mensagem" className="message-media" style={{ maxWidth: 220, borderRadius: 10, marginTop: 6 }} />
          )}
        </div>
      ))}
      {isLoading && <div className="loading" aria-busy="true">Carregando...</div>}
      <div ref={endRef} tabIndex={-1} aria-hidden="true" />
    </div>
  );
};

MessageDisplay.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      sender: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    avatar: PropTypes.string,
    color: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default MessageDisplay;
