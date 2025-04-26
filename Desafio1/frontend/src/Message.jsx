import React from "react";

function formatTime(ts) {
  if (!ts) return "";
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date();
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}


export default function Message({ m, isOwn, topFan }) {
  const isTopFan = topFan && m.user === topFan;
  const isBot = m.uid === 'furia-bot';
  return (
    <div
      className={
        'furia-msg' +
        (isOwn ? ' own-msg' : '') +
        (isTopFan ? ' topfan-msg' : '') +
        (isBot ? ' bot-msg' : '')
      }
      style={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        marginBottom: 10,
        gap: 7,
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        animation: isBot ? 'bot-pop 0.4s' : undefined,
        width: '100%',
        boxSizing: 'border-box'
      }}
    >

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start', width: '100%', marginRight: 10, marginLeft: 10,}}>
        {/* Nome, medalha e badge em linha acima do balão */}
        <span style={{display:'flex',alignItems:'center',gap:7,minHeight:2,marginBottom:10}}>
          {isTopFan && <span style={{fontSize:'1.13em',marginRight:2,filter:'drop-shadow(0 1px 5px #FFD60099)'}}>🥇</span>}
          <span style={{fontWeight:600, color:isTopFan ? '#FFD600' : '#fff', letterSpacing:0.15}}>{m.user}</span>
          {/* Badge de mensagem, se houver */}
          {m.badge && <span style={{marginLeft:2,filter:'drop-shadow(0 1px 4px #FFD60066)'}}>{m.badge}</span>}
        </span>
        {/* Balão da mensagem */}
        <div style={{
          background: isOwn ? '#FFD600' : '#23242b',
          color: isOwn ? '#181A20' : '#fff',
          borderRadius: isOwn ? '16px 16px 8px 16px' : '16px 16px 16px 8px',
          boxShadow: isOwn ? '0 2px 16px #FFD60044' : '0 1px 8px #0003',
          padding: '10px 18px 9px 18px',
          fontSize: '1.01em',
          fontWeight: 500,
          minWidth: 60,
          minHeight: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          marginBottom: 3,
          maxWidth: '72%'
        }}>
          <span style={{flex:1,wordBreak:'break-word'}}>{m.text}</span>
          <span style={{
            fontSize:'1.07em',
            fontWeight:700,
            color:isOwn?'#181A20':'#FFD600',
            marginLeft:12,
            alignSelf:'flex-end',
            textShadow: isOwn ? '0 1px 4px #FFD60077' : '0 1px 4px #0008'
          }}>{formatTime(m.ts)}</span>
        </div>
      </div>
    </div>
  );
}

