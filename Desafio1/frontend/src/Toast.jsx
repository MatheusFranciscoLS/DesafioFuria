import React from 'react';

/**
 * Toast notification component
 * @param {string} type - success | error | info
 * @param {string} message
 * @param {boolean} visible
 * @param {function} onClose
 */
export default function Toast({ type = 'info', message = '', visible = false, onClose }) {
  if (!visible) return null;
  let bg, color;
  switch (type) {
    case 'success': bg = '#4BB543'; color = '#fff'; break;
    case 'error': bg = '#e74c3c'; color = '#fff'; break;
    case 'info': default: bg = '#FFD600'; color = '#181A20'; break;
  }
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        background: bg,
        color,
        padding: '14px 28px',
        borderRadius: 10,
        boxShadow: '0 2px 16px #0007',
        zIndex: 9999,
        fontWeight: 600,
        fontSize: '1.08em',
        minWidth: 220,
        textAlign: 'center',
        animation: 'fadeInModal 0.3s',
        cursor: 'pointer',
      }}
      onClick={onClose}
      role="alert"
      aria-live="assertive"
    >
      {message}
      <span style={{ marginLeft: 16, fontWeight: 400, fontSize: '0.92em' }}>✖</span>
    </div>
  );
}
