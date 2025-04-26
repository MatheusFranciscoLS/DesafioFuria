import React, { useEffect, useRef, useState } from 'react';
import styles from './Leaderboard.module.css';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Mock de dados para exibição inicial
// Obtém usuário logado do localStorage (Google)
function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem('furia-user'));
  } catch {
    return null;
  }
}

const medals = ['🥇', '🥈', '🥉'];


export default function Leaderboard({ onClose }) {
  const loggedUser = getLoggedUser();
  const closeBtnRef = useRef();
  const [fans, setFans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    if (closeBtnRef.current) closeBtnRef.current.focus();
  }, []);

  // Sempre busca ranking ao abrir o modal
  useEffect(() => {
    setLoading(true);
    (async function fetchRanking() {
      try {
        // Busca top 10 fãs
        const q = query(collection(db, 'leaderboard'), orderBy('points', 'desc'), limit(10));
        const snap = await getDocs(q);
        const topFans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFans(topFans);
        // Busca posição do usuário logado (sempre pega do localStorage atualizado)
        const freshUser = getLoggedUser();
        if (freshUser && freshUser.uid) {
          const allQ = query(collection(db, 'leaderboard'), orderBy('points', 'desc'));
          const allSnap = await getDocs(allQ);
          const all = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const idx = all.findIndex(f => f.id === freshUser.uid);
          if (idx !== -1) setUserRank({ ...all[idx], pos: idx + 1 });
        }
      } catch (e) {
        setFans([]);
      }
      setLoading(false);
    })();
  }, [onClose]);


  function handleOverlayClick(e) {
    if (e.target.classList.contains(styles.leaderboardOverlay)) {
      onClose && onClose();
    }
  }

  if (!loggedUser) {
    return (
      <div className={styles.leaderboardOverlay} onClick={handleOverlayClick}>
        <div className={styles.leaderboardContainer}>
          <button
            className={styles.leaderboardCloseBtn}
            ref={closeBtnRef}
            title="Fechar ranking"
            aria-label="Fechar ranking"
            onClick={() => onClose && onClose()}
          >
            ×
          </button>
          <h2 className={styles.title} style={{display:'flex',alignItems:'center',gap:10}}>
            <span role="img" aria-label="Pantera FURIA" style={{fontSize:28}}>🐆</span>
            Top Torcedores FURIA
          </h2>
          <div style={{textAlign:'center', color:'#f9d923', fontWeight:800, fontSize:'1.25rem', marginTop:40, marginBottom:40}}>
            Faça login para ver seu ranking e competir com outros fãs!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.leaderboardOverlay} onClick={handleOverlayClick}>
      <div className={styles.leaderboardContainer}>
        <button
          className={styles.leaderboardCloseBtn}
          ref={closeBtnRef}
          title="Fechar ranking"
          aria-label="Fechar ranking"
          onClick={() => onClose && onClose()}
        >
          ×
        </button>
        <h2 className={styles.title}>🏆 Top Torcedores FURIA</h2>
        {loading ? (
          <div style={{color:'#f9d923', fontWeight:700, fontSize:'1.1rem', margin:'36px 0'}}>Carregando ranking...</div>
        ) : (
          <>
            <div className={styles.podiumRow}>
              {fans.slice(0, 3).map((fan, idx) => (
                <div className={styles.podiumItem} key={fan.id}>
                  <div className={styles.medal}>{medals[idx]}</div>
                  <img className={styles.avatarPodium} src={fan.avatar} alt={fan.name} />
                  <div className={styles.fanName}>{fan.name}</div>
                  <div className={styles.fanPoints}>{fan.points} pts</div>
                </div>
              ))}
            </div>
            <ol className={styles.fanList} aria-label="Lista de fãs ranqueados">
              {fans.slice(3).map((fan, idx) => (
                <li className={styles.fanListItem} key={fan.id}>
                  <span className={styles.position}>{idx + 4}º</span>
                  <img className={styles.avatar} src={fan.avatar} alt={fan.name} />
                  <span className={styles.fanNameList}>{fan.name}</span>
                  <span className={styles.fanPointsList}>{fan.points} pts</span>
                </li>
              ))}
            </ol>
            {userRank && userRank.pos > 10 && (
              <div style={{marginTop:24, background:'#232323', borderRadius:10, padding:'10px 0', color:'#f9d923', fontWeight:800}}>
                Sua posição: {userRank.pos}º — {userRank.name} ({userRank.points} pts)
              </div>
            )}
            <div className={styles.leaderboardFooter}>
              Interaja no chat para ganhar pontos e subir no ranking dos maiores fãs da FURIA!
            </div>
          </>
        )}
      </div>
    </div>
  );
}

