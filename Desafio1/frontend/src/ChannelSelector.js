import React from 'react';

export const CHANNELS = [
  { id: 'geral', label: '#geral' },
  { id: 'jogo-ao-vivo', label: '#jogo-ao-vivo' },
  { id: 'memes', label: '#memes' }
];

/**
 * Componente seletor de canais do chat
 * @param {{channel: string, setChannel: Function}} props
 */
export default function ChannelSelector({ channel, setChannel }) {
  return (
    <div style={{marginBottom:12}}>
      {CHANNELS.map(c => (
        <button
          key={c.id}
          onClick={() => setChannel(c.id)}
          style={{
            marginRight:8,
            background: channel === c.id ? '#111' : '#eee',
            color: channel === c.id ? '#fff' : '#111',
            border: 'none',
            borderRadius: 5,
            padding: '4px 12px',
            cursor: 'pointer',
            fontWeight: channel === c.id ? 'bold' : 'normal'
          }}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
