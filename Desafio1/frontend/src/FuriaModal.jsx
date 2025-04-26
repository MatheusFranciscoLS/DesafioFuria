import React from "react";

export default function FuriaModal({ open, onClose, onConfirm, message }) {
  if (!open) return null;
  return (
    <div className="furia-modal-overlay" tabIndex={0} aria-modal="true" role="dialog">
      <div className="furia-modal-center">
        <div className="furia-modal-card">
          <p style={{fontWeight:600, fontSize:'1.18em', marginBottom:18}}>{message}</p>
          <div className="furia-modal-btns">
            <button className="furia-btn" onClick={onConfirm} style={{marginRight:12}}>Sim, sair</button>
            <button className="furia-btn" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
