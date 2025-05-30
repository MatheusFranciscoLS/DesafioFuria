import React, { useState } from "react";
import { furiaModalidades } from "./furia-modalidades";

/**
 * Retorna o tempo relativo (ex: 'há 5min', 'agora') para um timestamp
 * @param {object|number} ts - Timestamp (Firestore ou epoch)
 * @returns {string} Tempo relativo formatado
 */
function timeAgo(ts) {
  if (!ts) return '';
  const now = Date.now();
  const t = ts.seconds ? ts.seconds * 1000 : Number(ts);
  const diff = Math.floor((now - t) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `há ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff/3600)}h`;
  return new Date(t).toLocaleDateString();
}

/**
 * Retorna um badge visual para o tipo de evento (gol, cartão, etc)
 * @param {string} type - Tipo de evento
 * @returns {JSX.Element|null} Elemento visual do badge ou null
 */
function eventBadge(type) {
  if (!type) return null;
  const badgeStyle = {
    gol: { background:'#FFD600', color:'#181A20' },
    cartao: { background:'#E53935', color:'#fff' },
    inicio: { background:'#43A047', color:'#fff' },
    fim: { background:'#23242b', color:'#FFD600', border:'1.5px solid #FFD600' },
    padrao: { background:'#23242b', color:'#FFD600', border:'1.5px solid #FFD600' }
  };
  const style = badgeStyle[type] || badgeStyle.padrao;
  return <span style={{...style, borderRadius:6, fontSize:'0.97em', padding:'2px 9px', fontWeight:700, marginRight:7, marginLeft:2, letterSpacing:0.2}}>{type.toUpperCase()}</span>;
}

/**
 * Eventos de exemplo para exibição inicial ou fallback
 * @type {Array<{icon: string, text: string}>}
 */
const EVENTOS_EXEMPLO = [
  { icon: '🔥', text: 'FURIA venceu o pistol round!' },
  { icon: '💥', text: 'KSCERATO fez um clutch 1v3!' },
  { icon: '🎯', text: 'arT abriu o bombsite com entry kill.' },
];

/**
 * Componente principal do Feed de Eventos
 * Exibe eventos filtrados por modalidade e permite seleção de modalidade
 * @param {Array} events - Lista de eventos recebidos por props
 * @param {string} modalidade - Modalidade selecionada
 * @param {Function} setModalidade - Função para alterar modalidade
 * @returns {JSX.Element} Feed de eventos renderizado
 */
export default function EventFeed({ events: propEvents, modalidade = 'all', setModalidade }) {
  // Estado local dos eventos e modal de detalhes
  // Usa eventos de exemplo se não vierem por props
  const [events, setEvents] = useState(propEvents && propEvents.length ? propEvents : EVENTOS_EXEMPLO);
  const [modal, setModal] = useState(null);

  /**
   * Limpa todos os eventos do feed
   */
  function clearEvents() {
    setEvents([]);
  }

  // Quantidade mínima de linhas para manter o feed visualmente agradável
  const minRows = 3;

  // Filtra eventos pela modalidade selecionada (exceto 'Todas')
  let filteredEvents = events;
  if (modalidade && modalidade !== 'all') {
    filteredEvents = events.filter(e => e.modalidade === modalidade);
  }
  // Preenche com placeholders caso não haja eventos
  const feedEvents = filteredEvents && filteredEvents.length ? filteredEvents : Array(minRows).fill(null);

  return (
    <section className="furia-eventfeed" style={{
      background:'#181A20',
      border:'1.5px solid #FFD60033',
      borderRadius:14,
      boxShadow:'0 2px 16px #0006',
      padding:'18px 18px 10px 18px',
      marginBottom:18,
      minWidth:230,
      maxWidth:480,
      minHeight:120,
      width:'100%',
      margin:'0 auto',
      display:'flex',
      flexDirection:'column',
      alignItems:'stretch',
      justifyContent:'flex-start',
      position:'relative'
    }}>
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
<h2 style={{color:'#FFD600',fontWeight:700,letterSpacing:0.2,fontSize:'1.19em',margin:'0 0 10px 0',textShadow:'0 1px 6px #0008',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
  Feed de Eventos
  <button onClick={clearEvents} style={{marginLeft:'auto',background:'none',border:'none',color:'#FFD600',fontWeight:700,fontSize:'1em',cursor:'pointer',opacity:0.8}} title="Limpar feed">🧹</button>
</h2>
      <ul style={{listStyle:'none',padding:0,margin:0,minHeight:80,display:'flex',flexDirection:'column',gap:8}}>
        {feedEvents.map((e, idx) => (
          e ? (
            <li key={idx} className="furia-event-item" style={{
              display:'flex',alignItems:'center',gap:12,background:'#23242b',borderRadius:9,padding:'9px 13px',boxShadow:'0 1px 6px #0003',
              cursor: e.details ? 'pointer' : 'default',
              animation: events.length && idx === 0 ? 'fadeInEvent 0.7s' : undefined
            }}
            onClick={() => e.details && setModal(e)}
            >
              <span className="event-icon" style={{fontSize:'1.5em',marginRight:6,filter:'drop-shadow(0 1px 6px #FFD60077)'}}>{e.icon}</span>
              {eventBadge(e.type)}
              <span style={{flex:1,fontWeight:600,color:'#fff',fontSize:'1.04em',wordBreak:'break-word'}}>{e.text}</span>
              {e.ts && <span style={{fontSize:'0.98em',color:'#FFD600',marginLeft:10,fontWeight:500,textShadow:'0 1px 3px #0008'}}>{timeAgo(e.ts)} <span style={{fontSize:'0.95em',opacity:0.7}}>({formatTime(e.ts)})</span></span>}
            </li>
          ) : (
            <li key={idx} className="furia-event-placeholder" style={{textAlign:'center',color:'#FFD60088',fontStyle:'italic',padding:'12px 0',opacity:0.6}}>
              Aguardando eventos do jogo...
            </li>
          )
        ))}
      </ul>
      {/* Modal de detalhes do evento */}
      {modal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'#000a',zIndex:99,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setModal(null)}>
          <div style={{background:'#23242b',color:'#fff',borderRadius:12,padding:30,minWidth:260,maxWidth:360,boxShadow:'0 2px 18px #000b',position:'relative'}} onClick={e=>e.stopPropagation()}>
            <button style={{position:'absolute',top:8,right:12,background:'none',border:'none',color:'#FFD600',fontSize:'1.5em',cursor:'pointer'}} onClick={()=>setModal(null)}>×</button>
            <div style={{fontSize:'2em',marginBottom:10}}>{modal.icon}</div>
            <div style={{fontWeight:700,fontSize:'1.12em',marginBottom:8}}>{modal.text}</div>
            {modal.details && <div style={{margin:'10px 0 0 0',fontSize:'1em',opacity:0.9}}>{modal.details}</div>}
            {modal.ts && <div style={{marginTop:16,fontSize:'0.98em',color:'#FFD600'}}>{timeAgo(modal.ts)} <span style={{fontSize:'0.96em',opacity:0.7}}>({formatTime(modal.ts)})</span></div>}
          </div>
        </div>
      )}
      {/* Animação fadeInEvent */}
      <style>{`
        @keyframes fadeInEvent {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

/**
 * Formata o timestamp para exibir apenas hora e minuto
 * @param {object|number} ts - Timestamp (Firestore ou epoch)
 * @returns {string} Hora formatada
 */
function formatTime(ts) {
  if (!ts) return '';
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
