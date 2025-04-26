import React from 'react';

function formatTime(ts) {
  if (!ts) return '';
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function Message({ m, isOwn }) {
  return (
    <div style={{
      marginBottom: 4,
      textAlign: isOwn ? 'right' : 'left',
      background: isOwn ? '#e1f5fe' : '#fff',
      borderRadius: 6,
      padding: '2px 6px',
      display: 'inline-block',
      minWidth: 80
    }}>
      {m.photo && <img src={m.photo} alt="avatar" style={{width:20,height:20,borderRadius:10,verticalAlign:'middle',marginRight:4}} />}
      <b>{m.user}:</b> {m.text}
      <span style={{fontSize:10,marginLeft:6,color:'#888'}}>{formatTime(m.ts)}</span>
    </div>
  );
}
