import React from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function GoogleLogin({ onLogin }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const handleGoogleLogin = async () => {
    setLoading(true); setError(null);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Salva/atualiza perfil no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
        email: user.email,
        lastLogin: serverTimestamp()
      }, { merge: true });
      // Salva dados básicos no localStorage
      localStorage.setItem('furia-user', JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
        email: user.email
      }));
      if (typeof onLogin === 'function') onLogin(user);
    } catch (e) {
      setError('Erro ao fazer login com Google: ' + e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
      <button onClick={handleGoogleLogin} disabled={loading} style={{
        background: '#fff', color: '#181818', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, padding: '12px 32px', boxShadow: '0 2px 10px #0002', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 12, opacity: loading ? 0.7 : 1
      }} aria-label="Entrar com Google">
        <svg width="28" height="28" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.07 1.53 7.47 2.82l5.52-5.38C33.63 4.14 29.27 2 24 2 14.82 2 6.98 7.98 3.56 16.09l6.77 5.26C12.25 14.76 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.76H24v9.06h12.42c-.54 2.77-2.18 5.1-4.66 6.68l7.19 5.59C43.96 36.14 46.1 30.81 46.1 24.55z"/><path fill="#FBBC05" d="M10.33 28.15a14.6 14.6 0 0 1 0-8.3l-6.77-5.26A23.98 23.98 0 0 0 2 24c0 3.87.92 7.54 2.56 10.85l7.77-6.7z"/><path fill="#EA4335" d="M24 44c5.27 0 9.67-1.74 12.89-4.74l-7.19-5.59c-2.01 1.35-4.6 2.16-7.7 2.16-6.38 0-11.75-5.26-13.67-12.23l-7.77 6.7C6.98 40.02 14.82 46 24 46z"/></g></svg>
        {loading ? 'Entrando...' : 'Entrar com Google'}
      </button>
      {error && <span style={{color:'#d32f2f',fontWeight:600,fontSize:15}}>{error}</span>}
    </div>
  );
}
