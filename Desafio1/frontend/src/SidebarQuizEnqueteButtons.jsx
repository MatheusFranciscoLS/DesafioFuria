import React from "react";

export default function SidebarQuizEnqueteButtons({ onQuiz, onEnquete }) {
  return (
    <div style={{display:'flex',gap:12,marginTop:14,justifyContent:'center'}}>
      <button
        type="button"
        className="furia-btn"
        style={{background:'#FFD600',color:'#181A20',fontWeight:700,borderRadius:8,padding:'7px 18px',border:'2px solid #FFD600',fontSize:'1em',boxShadow:'0 1px 6px #FFD60033'}}
        onClick={onQuiz}
      >
        🧠 Iniciar Quiz
      </button>
      <button
        type="button"
        className="furia-btn"
        style={{background:'#FFD600',color:'#181A20',fontWeight:700,borderRadius:8,padding:'7px 18px',border:'2px solid #FFD600',fontSize:'1em',boxShadow:'0 1px 6px #FFD60033'}}
        onClick={onEnquete}
      >
        📊 Responder Enquete
      </button>
    </div>
  );
}
