import React from "react";

/**
 * Modal genérico para Quiz ou Enquete
 * @param {object} props
 * @param {boolean} props.open - Se o modal está aberto
 * @param {function} props.onClose - Função para fechar o modal
 * @param {string} props.title - Título do modal
 * @param {JSX.Element} props.children - Conteúdo do modal
 */
export default function QuizEnqueteModal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="furia-modal-overlay" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#000a',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="furia-modal-content" style={{background:'#181A20',borderRadius:12,padding:28,minWidth:320,maxWidth:400,boxShadow:'0 2px 24px #000c',color:'#FFD600',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:16,right:16,background:'none',border:'none',color:'#FFD600',fontSize:22,cursor:'pointer'}} aria-label="Fechar">×</button>
        <h2 style={{marginTop:0,marginBottom:18,fontWeight:700,fontSize:'1.25em',color:'#FFD600'}}>{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
