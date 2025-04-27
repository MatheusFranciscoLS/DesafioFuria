import React from "react";
import "./furia-theme.css";
import { auth, googleProvider, signInAnonymously, signInWithPopup } from "./firebase";

/**
 * Tela inicial (Landing Page) da FURIA GG
 * Exibe informações institucionais, missão, recursos e botões para login.
 */
export default function Landing() {
  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e.code === "auth/popup-closed-by-user") {
        alert("Login cancelado. Tente novamente!");
      } else {
        alert("Erro ao autenticar: " + (e.message || e.code));
      }
    }
  };
  const handleAnon = async () => {
    try {
      await signInAnonymously(auth);
    } catch (e) {
      alert("Erro ao entrar como anônimo: " + (e.message || e.code));
    }
  };
  return (
    <div className="furia-landing-container">
      <header className="furia-header" style={{textAlign:'center',padding:'36px 0 16px 0'}}>
        <img src="/furia-logo.png" alt="FURIA Logo" className="furia-logo-anim" style={{margin:'0 auto',maxWidth:110}} />
        <h1 className="furia-title" style={{fontWeight:700,letterSpacing:2,fontSize:'2.2rem',margin:'14px 0 4px 0'}}>Bem-vindo à FURIA GG</h1>
        <p className="furia-slogan">Paixão, Garra e Inovação nos Esportes</p>
        <p style={{color:'#FFD600',margin:'10px 0 0 0',fontWeight:500}}>O ponto de encontro oficial dos fãs da FURIA!</p>
      </header>
      <main style={{maxWidth:600,margin:'0 auto',padding:'18px 10px'}}>
        <section style={{marginBottom:28}}>
          <h2 style={{fontSize:'1.3em',color:'#FFD600',marginBottom:9}}>Nossa Missão</h2>
          <p style={{color:'#fff',fontSize:'1.07em',marginBottom:10}}>
            Conectar apaixonados por esportes eletrônicos e tradicionais, promovendo interação, diversão e informação em tempo real.
          </p>
        </section>
        <section style={{marginBottom:28}}>
          <h2 style={{fontSize:'1.2em',color:'#FFD600',marginBottom:9}}>O que você encontra aqui?</h2>
          <ul style={{color:'#fff',fontSize:'1.08em',marginLeft:0,paddingLeft:18,lineHeight:1.7}}>
            <li>Chat ao vivo com outros fãs</li>
            <li>Ranking dos fãs mais ativos</li>
            <li>Notícias, eventos e novidades da FURIA</li>
            <li>Interação com o <b>Torcida Bot</b> para dúvidas e curiosidades</li>
            <li>Recados e mural de mensagens</li>
            <li>Suporte a várias modalidades: CS2, Valorant, FIFA, LOL e mais</li>
          </ul>
        </section>
        <section style={{marginBottom:34}}>
          <h2 style={{fontSize:'1.2em',color:'#FFD600',marginBottom:9}}>Junte-se à comunidade!</h2>
          <p style={{color:'#fff',fontSize:'1.06em'}}>Escolha como deseja participar e entre no chat:</p>
          <button className="furia-btn" style={{fontSize:'1.13em',marginTop:18,padding:'12px 38px',background:'#FFD600',color:'#181A20',fontWeight:700,boxShadow:'0 2px 12px #FFD60044'}} onClick={handleGoogle}>
            Entrar com Google
          </button>
          <button className="furia-btn" style={{fontSize:'1.13em',marginTop:14,padding:'12px 38px',background:'#222',color:'#FFD600',fontWeight:700,boxShadow:'0 2px 12px #FFD60044'}} onClick={handleAnon}>
            Entrar como Anônimo
          </button>
        </section>
      </main>
      <footer style={{textAlign:'center',marginTop:30,color:'#FFD60099',fontSize:'0.98em',letterSpacing:1}}>
        &copy; {new Date().getFullYear()} FURIA GG. Todos os direitos reservados.
      </footer>
    </div>
  );
}
