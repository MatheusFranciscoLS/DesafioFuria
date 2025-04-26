import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Buscar usuário pelo UID (seguro para identificação única)
export async function buscarUsuarioPorUID(uid) {
  const userDoc = doc(db, 'leaderboard', uid);
  const snapshot = await getDoc(userDoc);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
}

// Atualizar pontos do usuário pelo UID
export async function atualizarPontosUsuario(uid, novosPontos) {
  const userDoc = doc(db, 'leaderboard', uid);
  await updateDoc(userDoc, { points: novosPontos });
}
