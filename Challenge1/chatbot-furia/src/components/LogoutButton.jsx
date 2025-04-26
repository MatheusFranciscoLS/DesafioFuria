import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import styles from './LogoutButton.module.css';

export default function LogoutButton({ onLogout }) {
  const [loading, setLoading] = React.useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(getAuth());
      localStorage.removeItem('furia-user');
      if (typeof onLogout === 'function') onLogout();
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      className={styles.logoutBtn}
      onClick={handleLogout}
      disabled={loading}
      aria-label="Sair da conta"
      title="Sair da conta"
    >
      {loading ? 'Saindo...' : 'Sair'}
    </button>
  );
}
