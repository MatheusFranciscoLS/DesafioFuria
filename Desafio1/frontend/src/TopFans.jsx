import React from "react";

export default function TopFans({ messages }) {
  // Conta mensagens por usuário (robusto)
  const counts = {};
  messages.forEach(m => {
    // Tenta pegar nome do usuário de diferentes formas
    const nome = m.user || m.displayName || 'Anônimo';
    counts[nome] = (counts[nome] || 0) + 1;
  });
  const ranking = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const medals = ['🥇', '🥈', '🥉', '🎖️', '🏅'];

  return (
    <div className="furia-card" style={{marginBottom:16, background:'#181A20', color:'#FFD600'}}>
      <b>Ranking dos Fãs Mais Ativos</b>
      {ranking.length === 0 ? (
        <div style={{marginTop:8, color:'#fff'}}>Sem mensagens ainda neste canal.</div>
      ) : (
        <ol style={{margin:'8px 0 0 16px', padding:0}}>
          {ranking.map(([user, count], idx) => {
            // Busca badge e XP do localStorage (sincronizado com bot)
            let badges = '';
            let xp = '';
            try {
              const allBadges = JSON.parse(localStorage.getItem('furiaBadges')||'{}');
              const allXP = JSON.parse(localStorage.getItem('furiaXP')||'{}');
              badges = allBadges[user] || '';
              xp = allXP[user] || '';
            } catch {}
            return (
              <li key={user} style={{fontWeight: idx === 0 ? 'bold' : 'normal', display:'flex', alignItems:'center'}}>
                {medals[idx] || ''} <span style={{marginRight:5}}>{user}</span>
                {badges && <span style={{margin:'0 6px', fontSize:18}} title={badges}>{badges}</span>}
                {xp && <span style={{color:'#FFD600', fontSize:13, marginLeft:4}} title="XP">{xp} XP</span>}
                <span style={{color:'#fff',fontWeight:'normal', marginLeft:6}}>({count} msg)</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

