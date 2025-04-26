import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import MainChat from './MainChat.jsx';
import EventFeed from './EventFeed.jsx';
import { botResponder, BOT_NAME, BOT_PHOTO } from './torcida-bot';
import LiveStatus from './LiveStatus.jsx';
import Message from './Message.jsx';
import ChannelSelector, { CHANNELS } from './ChannelSelector.jsx';
import TopFans from './TopFans.jsx';
import { db, auth, googleProvider, signInAnonymously, signInWithPopup, signOut } from './firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import './furia-theme.css';

function App() {
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(CHANNELS[0].id);

  // Live status fetch
  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/live-status')
      .then(res => res.json())
      .then(setStatus);
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Listen messages (Firestore) - só se autenticado
  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, 'messages'),
      where('channel', '==', channel),
      orderBy('ts')
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => doc.data()));
    }, (err) => {
      alert('Erro ao ler mensagens: ' + (err.message || err.code));
      console.error('Erro ao ler mensagens do Firestore:', err);
    });
    return unsub;
  }, [channel, user]);

  const handleGoogleLogin = () => signInWithPopup(auth, googleProvider);

  const handleAnonLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (err) {
      alert('Erro ao entrar como anônimo: ' + (err.message || err.code));
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSend = async function handleSend(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    try {
      const newMsg = {
        text: msg,
        user: user.displayName || user.email || "Anônimo",
        photo: user.photoURL || null,
        ts: Date.now(),
        uid: user.uid || null,
        channel: channel,
      };
      setMsg("");
      await addDoc(collection(db, "messages"), newMsg);
      // Se for no canal #bot-ajuda, responde automaticamente
      if (channel === 'bot-ajuda') {
        const resposta = botResponder({ text: msg });
        if (resposta) {
          await addDoc(collection(db, "messages"), {
            text: resposta,
            user: BOT_NAME,
            photo: BOT_PHOTO,
            ts: serverTimestamp(),
            uid: 'furia-bot',
            channel: channel,
          });
        }
      }
    } catch (err) {
      alert('Erro ao enviar mensagem: ' + (err.message || err.code));
    }
  };

  // Rolagem automática para última mensagem
  React.useEffect(() => {
    const chatbox = document.getElementById('chatbox');
    if (chatbox) chatbox.scrollTop = chatbox.scrollHeight;
  }, [messages]);

  // Top fãs para sidebar
  // Novo: ranking por UID, para garantir unicidade e nome/badge sincronizado
  const fanMap = {};
  messages.forEach(m => {
    if (!m.uid) return;
    if (!fanMap[m.uid]) {
      fanMap[m.uid] = { count: 0, lastMsg: m };
    }
    fanMap[m.uid].count++;
    // Sempre pega a mensagem mais recente para nome/foto
    if (!fanMap[m.uid].lastMsg.ts || (m.ts && m.ts > fanMap[m.uid].lastMsg.ts)) {
      fanMap[m.uid].lastMsg = m;
    }
  });
  const medals = ['🥇', '🥈', '🥉', '🎖️', '🏅'];
  const topFansArr = Object.entries(fanMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([uid, { count, lastMsg }], idx) => ({
      user: lastMsg.user,
      count,
      medal: medals[idx] || '',
      uid
    }));
  const topFan = topFansArr.length > 0 ? topFansArr[0].user : null;

  // Placeholder de eventos (em breve: integração real)
  const eventFeed = [
    { icon: '🔥', text: 'FURIA venceu o pistol round!' },
    { icon: '💥', text: 'KSCERATO fez um clutch 1v3!' },
    { icon: '🎯', text: 'arT abriu o bombsite com entry kill.' },
  ];

  return (
    <div id="furia-root" className="furia-layout">
      <div className="furia-header">
        <div className="furia-logo-wrap">
          <img src="/furia-logo.png" alt="FURIA Logo" className="furia-logo-anim" />
        </div>
        <h1>FURIA Fan Chat</h1>
        <p>Bem-vindo ao chat oficial dos fãs da FURIA!</p>
        <span className="furia-slogan">#FURIAÉNOSSA | Paixão e Garra nos Esportes</span>
      </div>
      <div className="furia-content-row">
        <Sidebar channel={channel} setChannel={setChannel} topFans={topFansArr} user={user} />

        <MainChat
          user={user}
          messages={messages}
          handleSend={handleSend}
          msg={msg}
          setMsg={setMsg}
          handleLogout={handleLogout}
          topFan={topFan}
          loading={loading}
          liveStatus={status}
          handleGoogleLogin={handleGoogleLogin}
          handleAnonLogin={handleAnonLogin}
          channel={channel}
        />
        <EventFeed events={eventFeed} />
      </div>
      {/* Mais painéis e features podem ser adicionados aqui! */}
    </div>
  );
}

export default App;
