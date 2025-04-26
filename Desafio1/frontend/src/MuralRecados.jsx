import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from "firebase/firestore";
import Badges from "./Badges";

function formatTime(ts) {
  if (!ts) return "";
  const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date();
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MuralRecados({ user, topFanUid, topFansArr = [] }) {
  const [recado, setRecado] = useState("");
  const [recados, setRecados] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "recados"), orderBy("ts", "desc"), limit(10));
    const unsub = onSnapshot(q, snap => {
      setRecados(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const [enviando, setEnviando] = useState(false);
  async function enviarRecado(e) {
    e.preventDefault();
    if (!recado.trim() || !user) return;
    setEnviando(true);
    try {
      await addDoc(collection(db, "recados"), {
        text: recado,
        user: user.displayName || user.email || "Anônimo",
        photo: user.photoURL || null,
        ts: serverTimestamp(),
        uid: user.uid || null
      });
      setRecado("");
    } catch (err) {
      alert("Erro ao enviar recado: " + (err.message || err.code));
    } finally {
      setEnviando(false);
    }
  }

  // Badge counts por UID (sincronizado com topFansArr se possível)
  const badgeCounts = {};
  recados.forEach(r => {
    if (!r.uid) return;
    const fan = topFansArr.find(f => f.uid === r.uid);
    badgeCounts[r.uid] = fan ? fan.count : (r.count || recados.filter(x => x.uid === r.uid).length);
  });

  return (
    <div className="furia-mural-recados">
      <form onSubmit={enviarRecado} style={{ display: 'flex', gap: 0, marginBottom: 8, width: '100%' }}>
        <input
          className="furia-input"
          style={{ flex: 1, minWidth: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: 'none' }}
          value={recado}
          onChange={e => setRecado(e.target.value)}
          placeholder="Deixe seu salve!"
          maxLength={80}
          disabled={!user}
          autoComplete="off"
        />
        <button
          type="submit"
          className="furia-btn"
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, minWidth: 68, fontWeight: 600, fontSize: '1em', height: 38 }}
          disabled={!recado.trim() || !user || enviando}
        >{enviando ? 'Enviando...' : 'Enviar'}</button>
      </form>
      <div className="furia-recados-list">
        {recados.map(r => {
          const badge = r.uid && badgeCounts[r.uid] !== undefined
            ? <span style={{marginLeft:2,filter:'drop-shadow(0 1px 4px #FFD60066)'}}><Badges count={badgeCounts[r.uid]} /></span>
            : null;
          return (
            <div key={r.id} className="furia-recado-item">
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="furia-recado-user" style={{display:'flex',alignItems:'center',gap:6,minHeight:24,marginBottom:8}}>
                  {topFanUid && r.uid === topFanUid && (
                    <span style={{fontSize:'1.16em',marginRight:2,filter:'drop-shadow(0 1px 5px #FFD60088)'}}>🥇</span>
                  )}
                  <span style={{fontWeight:600, color:'#FFD600', letterSpacing:0.2}}>{r.user}</span>
                  {badge}
                </span>
                <span
                  className="furia-recado-text"
                  style={{display:'block',textAlign:'left',padding:'10px 16px 10px 16px',background:'#23242b',borderRadius:12,maxWidth:'80%',color:'#fff',fontSize:'1.06em',marginBottom:3,boxShadow:'0 1px 8px #0002'}}
                  dangerouslySetInnerHTML={{ __html: r.text.replace(/(:[^\s:]+:)/g, '<span>$1</span>') }}
                />
                <span className="furia-recado-time" style={{fontSize:'1.03em',fontWeight:700,color:'#FFD600',marginLeft:6,textShadow:'0 1px 4px #0008'}}>{formatTime(r.ts)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
