// src/components/UserSetup.jsx
// Tela para o usuário escolher avatar e cor do balão antes de entrar no chat
import React, { useState } from 'react';

const AVATARS = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
];
const COLORS = ['#f9d923', '#f7b801', '#e74c3c', '#232323'];

const UserSetup = ({ onFinish }) => {
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [name, setName] = useState('Fã FURIA');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await onFinish({ avatar, color, name });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="user-setup" onSubmit={handleSubmit} tabIndex={0} aria-label="Escolha seu avatar e cor">
      <h2>Personalize sua experiência</h2>
      <div className="avatar-select">
        {AVATARS.map(a => (
          <img
            key={a}
            src={a}
            alt="Avatar"
            className={`avatar-choice${avatar === a ? ' selected' : ''}`}
            onClick={() => { setAvatar(a); console.log('Avatar selecionado:', a); }}
            aria-label={`Escolher avatar ${a}`}
          />
        ))}
      </div>
      <div className="color-select">
        {COLORS.map(c => (
          <button
            key={c}
            type="button"
            className={`color-choice${color === c ? ' selected' : ''}`}
            style={{ background: c, borderColor: color === c ? '#181818' : '#ccc' }}
            onClick={() => setColor(c)}
            aria-label={`Escolher cor ${c}`}
          />
        ))}
      </div>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Seu nome ou apelido"
        maxLength={16}
        className="name-input"
        aria-label="Seu nome"
        required
      />
      <button
        type="submit"
        className="setup-confirm"
        disabled={loading}
        style={{
          background: '#f9d923',
          color: '#181818',
          fontWeight: 900,
          border: 'none',
          borderRadius: 8,
          fontSize: 17,
          padding: '10px 0',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          minWidth: 110
        }}
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default UserSetup;
