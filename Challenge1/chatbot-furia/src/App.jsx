// src/App.jsx
// App principal do Chatbot Fúria Tech
import React, { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';
import FanRanking from './components/FanRanking';
import QuizFuria from './components/QuizFuria';
import SocialLinks from './components/SocialLinks';
import LogoutButton from './components/LogoutButton';
import LandingPage from './components/LandingPage';
import GoogleLogin from './components/GoogleLogin';
import UserSetup from './components/UserSetup';
import './styles/app.css';
import './styles/landing.css';
import './styles/theme.css';
import './styles/user-setup.css';
import './styles/notification-toast.css';
import NotificationToast from './components/NotificationToast';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  const [entered, setEntered] = useState(false);
  const [setupDone, setSetupDone] = useState(() => !!localStorage.getItem('furia-user'));
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    document.body.classList.add('furia-dark');
    document.body.classList.remove('furia-light');
    localStorage.removeItem('furia-theme');
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        <main className="App furia-dark" role="main">
          <NotificationToast
            message={toast.message}
            show={toast.show}
            onClose={() => setToast(t => ({ ...t, show: false }))}
          />
          {!entered ? (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#111'}}>
              <header style={{ textAlign: 'center', marginBottom: 32 }}>
                <img src="/furia-logo.png" alt="Logo FURIA" style={{ height: 72, marginBottom: 16 }} />
                <h1 tabIndex={0} style={{
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  color: '#f9d923',
                  fontWeight: 900,
                  letterSpacing: 1.2,
                  fontSize: 38,
                  margin: 0,
                  textShadow: '2px 2px 12px #181818'
                }}>
                  Chatbot FURIA
                </h1>
                <p style={{ color: '#fafafa', marginTop: 10, fontSize: 18, fontWeight: 500 }}>
                  O melhor chatbot para fãs de Esports do Brasil. Faça login para começar!
                </p>
              </header>
              <div style={{display:'flex',justifyContent:'center',alignItems:'center',margin:'0 auto',width:'100%'}}>
                <GoogleLogin onLogin={() => setEntered(true)} />
              </div>
            </div>
          ) : !setupDone ? (
            <UserSetup onFinish={() => setSetupDone(true)} />
          ) : (
            <>
              <header style={{ textAlign: 'center', marginBottom: 12, position:'relative', minHeight: 80 }}>
                <img src="/furia-logo.png" alt="Logo FURIA" style={{ height: 64, marginBottom: 8 }} />
                <h1 tabIndex={0} style={{
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  color: '#f9d923',
                  fontWeight: 900,
                  letterSpacing: 1.2,
                  fontSize: 32,
                  margin: 0,
                  textShadow: '2px 2px 8px #181818'
                }}>
                  Chatbot FURIA
                </h1>
                <p style={{ color: '#fafafa', marginTop: 8, fontSize: 16, fontWeight: 400 }}>
                  Bem-vindo(a), fã! Converse, descubra curiosidades e viva a experiência FURIA 💛🖤
                </p>
                <div style={{position:'absolute',top:10,right:24}}>
                  <LogoutButton onLogout={() => { localStorage.removeItem('furia-user'); window.location.reload(); }} />
                </div>
              </header>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#111'}}>
                <div style={{width:'100%',maxWidth:900,display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:32,marginBottom:48}}>
                  <div style={{flex:'1 1 340px',minWidth:320,maxWidth:420}}>
                    <div className="fadeInUp" style={{animationDelay:'0.1s'}}><FanRanking /></div>
<div className="fadeInUp" style={{animationDelay:'0.2s'}}><QuizFuria /></div>
<div className="fadeInUp" style={{animationDelay:'0.3s'}}><SocialLinks /></div>
                  </div>
                  <div style={{flex:'2 1 420px',minWidth:340,maxWidth:540}}>
                    <div className="fadeInUp" style={{animationDelay:'0.2s'}}><Chatbot /></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
