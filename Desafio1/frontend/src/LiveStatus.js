import React from 'react';

/**
 * Exibe o status ao vivo de uma partida
 * @param {{status: object}} props
 */
export default function LiveStatus({ status }) {
  if (!status) return null;
  return (
    <div style={{background:'#222',color:'#fff',padding:'1em',borderRadius:8,marginBottom:16}}>
      <h3>Live Status: {status.match}</h3>
      <p>Status: {status.status}</p>
      <p>Placar: {status.score} | Round: {status.round} | Mapa: {status.map}</p>
      <p>Horário: {status.time}</p>
    </div>
  );
}
