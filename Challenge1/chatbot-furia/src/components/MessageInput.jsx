// src/components/Chatbot/MessageInput.jsx
// Campo de entrada de mensagem do chat
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  // Atualiza o campo de texto
  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  // Envia mensagem ao clicar ou pressionar Enter
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <form className="message-input" onSubmit={e => { e.preventDefault(); handleSend(); }} aria-label="Enviar mensagem">
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Digite sua mensagem..."
        aria-label="Campo de mensagem"
        disabled={isLoading}
        autoFocus
      />
      <button
        type="submit"
        disabled={isLoading || !message.trim()}
        aria-label="Enviar mensagem"
        style={{
          background: '#f9d923',
          color: '#181818',
          fontWeight: 900,
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          padding: '7px 0',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
          minWidth: 90
        }}
      >
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

MessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
MessageInput.defaultProps = {
  isLoading: false,
};

export default MessageInput;
