import React from "react";

export const CHANNELS = [
  { id: "geral", label: "#geral" },
  { id: "jogo-ao-vivo", label: "#jogo-ao-vivo" },
  { id: "bot-ajuda", label: "#bot-ajuda" },
];

export default function ChannelSelector({ channel, setChannel }) {
  return (
    <div style={{ marginBottom: 12 }}>
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
  );
}
