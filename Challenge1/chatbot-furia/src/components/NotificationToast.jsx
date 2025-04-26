// src/components/NotificationToast.jsx
// Toast para notificações (ex: novo jogo)
import React, { useEffect } from 'react';

const toastPositions = {
  'top-right': { top: 22, right: 22 },
  'top-left': { top: 22, left: 22 },
  'bottom-right': { bottom: 22, right: 22 },
  'bottom-left': { bottom: 22, left: 22 },
};

const NotificationToast = ({ message, show, onClose, duration = 3500, position = 'top-right' }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;
  const posStyle = toastPositions[position] || toastPositions['top-right'];
  const isLoadingMsg = typeof message === 'string' && message.toLowerCase().includes('carregando');
  return (
    <div
      className="notification-toast"
      tabIndex={0}
      aria-live="assertive"
      role="status"
      style={{
        ...posStyle,
        position: 'fixed',
        zIndex: 9999,
        background: '#232323',
        color: '#f9d923',
        fontWeight: 700,
        fontSize: 15,
        borderRadius: 10,
        boxShadow: '0 2px 14px #18181866',
        padding: isLoadingMsg ? '9px 16px' : '13px 22px',
        minWidth: 160,
        maxWidth: 330,
        textAlign: 'center',
        outline: 'none',
        transition: 'all .3s cubic-bezier(.4,0,.2,1)',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        lineHeight: 1.6,
        letterSpacing: 0.2,
        whiteSpace: 'pre-line',
        wordBreak: 'break-word',
        userSelect: 'text',
        height: 'auto',
        maxHeight: 120,
        overflow: 'auto',
        margin: 0
      }}
    >
      {isLoadingMsg ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="toast-skeleton" style={{ width: 70, height: 16, borderRadius: 6, background: '#eaeaea', animation: 'pulse 1.2s infinite alternate' }} />
          <span className="toast-skeleton" style={{ width: 40, height: 16, borderRadius: 6, background: '#eaeaea', animation: 'pulse 1.2s infinite alternate' }} />
        </span>
      ) : (
        <span>{message}</span>
      )}
      <button
        onClick={onClose}
        aria-label="Fechar notificação"
        style={{ background: 'none', border: 'none', color: '#181818', fontWeight: 900, fontSize: 22, cursor: 'pointer', padding: 4, borderRadius: 6, minWidth: 36 }}
      >
        ×
      </button>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-30px) scale(0.95); }
        }
        @keyframes pulse {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
        @media (max-width: 500px) {
          .notification-toast {
            min-width: 92vw !important;
            max-width: 97vw !important;
            font-size: 14px !important;
            padding: 9px 4px !important;
            text-align: center !important;
            border-radius: 9px !important;
            max-height: 80px !important;
            overflow: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
