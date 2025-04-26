import React from 'react';

export default function SocialShare({ user, points }) {
  const shareText = `Estou no ranking dos fãs da FURIA! Pontuação: ${points} 🏅 #GoFURIA`;
  const shareUrl = window.location.href;

  const handleShare = (platform) => {
    let url = '';
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '18px 0 0 0' }}>
      <button onClick={() => handleShare('twitter')} aria-label="Compartilhar no Twitter" title="Compartilhar no Twitter" style={{ background: '#181818', color: '#1DA1F2', border: 'none', fontSize: 20, cursor: 'pointer', borderRadius: 8, padding: '6px 14px' }}>🐦 Twitter</button>
      <button onClick={() => handleShare('whatsapp')} aria-label="Compartilhar no WhatsApp" title="Compartilhar no WhatsApp" style={{ background: '#181818', color: '#25D366', border: 'none', fontSize: 20, cursor: 'pointer', borderRadius: 8, padding: '6px 14px' }}>💬 WhatsApp</button>
      <button onClick={() => handleShare('facebook')} aria-label="Compartilhar no Facebook" title="Compartilhar no Facebook" style={{ background: '#181818', color: '#4267B2', border: 'none', fontSize: 20, cursor: 'pointer', borderRadius: 8, padding: '6px 14px' }}>📘 Facebook</button>
    </div>
  );
}
