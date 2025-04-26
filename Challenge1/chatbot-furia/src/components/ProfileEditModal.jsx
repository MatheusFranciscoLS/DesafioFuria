import React from 'react';

export default function ProfileEditModal({ name, setName, onClose, onSave, isLoading }) {
  return (
    <div role="dialog" aria-modal="true" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000a', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onKeyDown={e => { if (e.key === 'Escape') onClose(); }}>
      <form onSubmit={onSave} style={{ background: '#181818', color: '#fff', padding: 30, borderRadius: 16, minWidth: 320, maxWidth: 380, width: '95vw', boxSizing: 'border-box', boxShadow: '0 6px 32px #000c', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
        <button type="button" onClick={onClose} aria-label="Fechar edição" style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: '#fff', fontSize: 26, cursor: 'pointer', padding: 8, borderRadius: 8, minWidth: 36, minHeight: 36, touchAction: 'manipulation' }}>×</button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Editar Perfil</h2>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          Nome:
          <input type="text" value={name} onChange={e => setName(e.target.value)} maxLength={24} autoFocus required style={{ padding: 8, borderRadius: 6, border: '1px solid #f9d923', fontSize: 16 }} />
        </label>
        <button type="submit" disabled={isLoading} style={{ background: '#f9d923', color: '#181818', fontWeight: 900, border: 'none', borderRadius: 8, fontSize: 17, padding: '10px 0', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: 8, opacity: isLoading ? 0.7 : 1 }}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
        <style>{`
          @media (max-width: 500px) {
            form {
              min-width: 0 !important;
              max-width: 98vw !important;
              padding: 10vw 2vw 6vw 2vw !important;
              font-size: 15px !important;
            }
            form h2 {
              font-size: 17px !important;
            }
            form button[type='submit'] {
              font-size: 15px !important;
              padding: 8px 0 !important;
            }
            form input[type='text'] {
              font-size: 14px !important;
              padding: 7px !important;
            }
          }
        `}</style>
      </form>
    </div>
  );
}
