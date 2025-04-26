import React from "react";
import { CHANNELS } from "./ChannelSelector.jsx";
import Badges from "./Badges";
import MuralRecados from "./MuralRecados";

export default function Sidebar({ channel, setChannel, topFans, user }) {
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
      </div>
      <div className="furia-sidebar-section">
        <div className="furia-sidebar-label">Top Fãs</div>
        <ol className="furia-topfans-list">
          {topFans.map(({ user, count }, idx) => {
            const medals = ['🥇','🥈','🥉','🎖️','🏅'];
            const medal = medals[idx] || '';
            return (
              <li key={user} className={idx === 0 ? "top-fan-highlight" : ""} style={{display:'flex',alignItems:'center',gap:4}}>
                <span style={{fontSize:'1.25em',marginRight:2}}>{medal}</span>
                <span style={{fontWeight:500}}>{user}</span>
                <Badges count={count} />
                <span className="topfans-count">({count})</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="furia-sidebar-section">
        <div className="furia-sidebar-label">Mural de Recados</div>
        <MuralRecados user={user} topFanUid={topFans && topFans[0] ? topFans[0].uid : null} topFansArr={topFans} />
      </div>
    </aside>
  );
}
