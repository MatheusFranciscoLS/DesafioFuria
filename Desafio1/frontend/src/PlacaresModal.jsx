import React, { useEffect, useState } from "react";
import { fetchPlacares } from "./bot-placares-util";

export default function PlacaresModal({ open, onClose }) {
  const [placares, setPlacares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setErro("");
    fetchPlacares().then((placares) => {
      setPlacares(placares);
      setLoading(false);
    }).catch(() => {
      setErro("Erro ao buscar placares. Tente novamente mais tarde.");
      setLoading(false);
    });
  }, [open]);

  if (!open) return null;

  return (
    <div className="furia-modal-overlay" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.65)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="furia-modal-content" style={{background:'#222',color:'#fff',borderRadius:12,padding:32,minWidth:320,maxWidth:750,boxShadow:'0 4px 32px #000',position:'relative',width:'90vw'}}>
        <button onClick={onClose} style={{position:'absolute',top:12,right:12,fontSize:22,background:'none',border:'none',color:'#FFD600',cursor:'pointer'}} title="Fechar">×</button>
        <h2 style={{marginTop:0,marginBottom:18,color:'#FFD600'}}>Placares Recentes</h2>
        {loading && <div>Carregando...</div>}
        {erro && <div style={{color:'#FFD600'}}>{erro}</div>}
        {!loading && !erro && (
          placares.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 18,
              margin: '0 0 8px 0'
            }}>
              {placares.slice(0, 12).map((p, idx) => (
                <div key={idx} style={{
                  background:'#111',
                  borderRadius:12,
                  padding:'18px 14px',
                  boxShadow:'0 2px 8px #0002',
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'flex-start',
                  minHeight:120,
                  border:'1.5px solid #FFD60022'
                }}>
                  <div style={{fontWeight:700,fontSize:17,color:'#FFD600',marginBottom:4}}>{p.modalidade.toUpperCase()}</div>
                  <div style={{fontWeight:500,fontSize:15,marginBottom:2}}>vs {p.adversario}</div>
                  <div style={{fontSize:14,margin:'2px 0'}}>Data: <b>{p.data}</b></div>
                  <div style={{fontSize:14,margin:'2px 0'}}>Placar: <b>{p.resultado}</b></div>
                  <div style={{fontSize:13,opacity:.85}}>Torneio: {p.torneio}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>Nenhum placar disponível no momento.</div>
          )
        )}
      </div>
    </div>
  );
}
