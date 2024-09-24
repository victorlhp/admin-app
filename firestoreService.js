// firestoreService.js

import { db } from './firebase'; // Certifique-se de que o caminho está correto
import { doc, getDoc } from 'firebase/firestore';

// Função para obter dados de um usuário específico pelo UID
export const getUserData = async (userId) => {
  try {
    const userDoc = doc(db, 'usuarios', userId); // Certifique-se que 'usuarios' é a coleção correta
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      return docSnap.data(); // Retorna os dados do usuário
    } else {
      console.log('Usuário não encontrado.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};
