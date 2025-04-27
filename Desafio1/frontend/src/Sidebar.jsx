import React, { useState } from "react";
import { CHANNELS } from "./ChannelSelector.jsx";
import Badges from "./Badges";
import MuralRecados from "./MuralRecados";
import JogosAgendaModal from "./JogosAgendaModal";
import PlacaresModal from "./PlacaresModal";

export default function Sidebar({ channel, setChannel, topFans, user }) {
  const [openJogos, setOpenJogos] = useState(false);
  const [openPlacares, setOpenPlacares] = useState(false);
  return (
    <aside className="furia-sidebar">
      <div className="furia-sidebar-section">
        <h2>Canais</h2>
        <div className="furia-sidebar-channels">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              className={
                "furia-channel-btn" + (channel === c.id ? " active" : "")
              }
              onClick={() => setChannel(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button
          className="furia-jogos-btn"
          style={{marginTop:14,background:'#FFD600',color:'#222',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:600,cursor:'pointer',width:'100%'}}
          onClick={() => setOpenJogos(true)}
        >
          🏆 Agenda de Jogos
        </button>
        <button
          className="furia-placares-btn"
          style={{marginTop:8,background:'#FFD600',color:'#222',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:600,cursor:'pointer',width:'100%'}}
          onClick={() => setOpenPlacares(true)}
        >
          📊 Placares Recentes
        </button>
        <JogosAgendaModal open={openJogos} onClose={() => setOpenJogos(false)} />
        <PlacaresModal open={openPlacares} onClose={() => setOpenPlacares(false)} />
      </div>

      {channel !== 'bot-ajuda' && (
        <div className="furia-sidebar-section">
          <div className="furia-sidebar-label">Top Fãs</div>
          <ol className="furia-topfans-list">
            {topFans.map(({ user, count, uid }, idx) => {
              const medals = ['🥇','🥈','🥉','🎖️','🏅'];
              const medal = medals[idx] || '';
              return (
                <li key={uid} className={idx === 0 ? "top-fan-highlight" : ""} style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{fontSize:'1.25em',marginRight:2}}>{medal}</span>
                  <span style={{fontWeight:500}}>{user}</span>
                  <Badges count={count} />
                  <span className="topfans-count">({count})</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
      <div className="furia-sidebar-section">
        <div className="furia-sidebar-label">Mural de Recados</div>
        <MuralRecados user={user} topFanUid={topFans && topFans[0] ? topFans[0].uid : null} topFansArr={topFans} />
      </div>

      <div className="furia-sidebar-section" style={{marginTop:18}}>
        <div className="furia-sidebar-label">Redes Sociais</div>
        <div className="furia-social-links">
          <a href="https://twitter.com/furiagg" target="_blank" rel="noopener noreferrer" title="Twitter/X">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.46 5.94c-.77.34-1.6.57-2.47.67a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.14 12.14 0 0 1 3.11 4.7a4.28 4.28 0 0 0 1.33 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.29 4.29 0 0 0 3.43 4.2c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.14 12.14 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57.84-.6 1.57-1.35 2.15-2.2z"></path></svg>
          </a>
          <a href="https://instagram.com/furiagg" target="_blank" rel="noopener noreferrer" title="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
          </a>
          <a href="https://youtube.com/furiagg" target="_blank" rel="noopener noreferrer" title="YouTube">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </a>
          <a href="https://tiktok.com/@furiagg" target="_blank" rel="noopener noreferrer" title="TikTok">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17a5 5 0 1 1 0-10h2v8a3 3 0 1 0 3-3h2a5 5 0 1 1-7 5z"/></svg>
          </a>
        </div>
      </div>
    </aside>
  );
}
