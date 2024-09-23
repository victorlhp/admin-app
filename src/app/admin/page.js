"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import '../globals.css';

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const router = useRouter();

  // Verifica se o administrador está logado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Função de busca por email, nome ou UID
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      // Fazendo três buscas separadas por email, nome ou UID
      const qEmail = query(collection(db, "usuarios"), where("email", "==", searchQuery));
      const qName = query(collection(db, "usuarios"), where("nome", "==", searchQuery));
      const qUid = query(collection(db, "usuarios"), where("__name__", "==", searchQuery)); // UID é o ID do documento no Firestore

      // Executa todas as consultas de busca
      const [emailSnapshot, nameSnapshot, uidSnapshot] = await Promise.all([
        getDocs(qEmail),
        getDocs(qName),
        getDocs(qUid)
      ]);

      // Combina os resultados das três buscas, evitando duplicatas
      const users = [
        ...emailSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...nameSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ...uidSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      ];

      setFilteredUsers(users);
    }
  };

  // Redireciona para a página de resultados com o ID do usuário
  const viewResults = (userId) => {
    router.push(`/admin/results/${userId}`); // Navega para a página de resultados
  };

  if (!user) {
    return <div>Aguarde...</div>;
  }

  return (
    <div>
      <h1>Página do Administrador</h1>
      <h2>Bem-vindo, {user.email}</h2>

      <div>
        <input
          type="text"
          placeholder="Buscar por email, nome ou UID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      <ul>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id}>
              {user.email || user.nome || user.id} -{" "}
              <button onClick={() => viewResults(user.id)}>Ver Resultados</button>
            </li>
          ))
        ) : (
          <li>Nenhum usuário encontrado</li>
        )}
      </ul>
    </div>
  );
};

export default AdminPage;
