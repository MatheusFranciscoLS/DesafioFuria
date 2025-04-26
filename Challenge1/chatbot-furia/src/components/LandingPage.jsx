// src/components/LandingPage.jsx
// Página de boas-vindas imersiva para o Chatbot FURIA
import React, { useState } from 'react';
import GoogleLogin from './GoogleLogin';

const LandingPage = ({ onEnter }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('furia-user'));
    } catch {
      return null;
    }
  });

  const handleGoogleLogin = (userObj) => {
    setUser({
      uid: userObj.uid,
      name: userObj.displayName,
      avatar: userObj.photoURL,
      email: userObj.email
    });
  };

  const handleEnter = async () => {
    setLoading(true);
    try {
      await onEnter();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="landing-page" tabIndex={0} aria-label="Boas-vindas FURIA">
      <img src="/furia-logo.png" alt="Logo FURIA" className="landing-logo" />
      <h1 className="landing-title">Bem-vindo à Experiência FURIA</h1>
      <p className="landing-desc">
        Converse, descubra curiosidades, desafie-se no quiz e viva a torcida como nunca!<br />
        <span className="landing-highlight">O chat mais completo para fãs de CS:GO no Brasil.</span>
      </p>
      {!user && (
        <div style={{marginBottom:24, marginTop:12, display:'flex', justifyContent:'center'}}>
          <GoogleLogin onLogin={handleGoogleLogin} />
        </div>
      )}
      <button
        className="landing-enter"
        onClick={handleEnter}
        aria-label="Entrar no chat"
        disabled={loading || !user}
        style={{
          background: user ? '#f9d923' : '#bdbdbd',
          color: '#181818',
          fontWeight: 900,
          border: 'none',
          borderRadius: 8,
          fontSize: 18,
          padding: '13px 0',
          cursor: loading || !user ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          minWidth: 170
        }}
      >
        {user ? (loading ? 'Entrando...' : 'Entrar no Chat') : 'Faça login para entrar'}
      </button>
      <div className="landing-footer">Powered by React • Desafio FURIA 2025</div>
    </section>
  );
};

export default LandingPage;
