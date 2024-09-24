"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase"; 
import { collection, getDocs, query, where } from "firebase/firestore";
import '../globals.css'; 
import { getUserData } from "../../../firestoreService"; 

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [results, setResults] = useState(null);

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

  // Função de busca
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      // Faz a busca por email
      const qEmail = query(
        collection(db, "usuarios"),
        where("email", "==", searchQuery)
      );
      const querySnapshotEmail = await getDocs(qEmail);
      let users = querySnapshotEmail.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Se não encontrar por email, tenta buscar por nome
      if (users.length === 0) {
        const qNome = query(
          collection(db, "usuarios"),
          where("nome", "==", searchQuery)
        );
        const querySnapshotNome = await getDocs(qNome);
        users = querySnapshotNome.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      // Se não encontrar por nome, tenta buscar diretamente pelo UID
      if (users.length === 0) {
        // Aqui você simplesmente usa `doc.id` diretamente no Firestore, já que o UID é o ID do documento
        const qUID = query(collection(db, "usuarios"));
        const querySnapshotUID = await getDocs(qUID);
        users = querySnapshotUID.docs
          .filter((doc) => doc.id === searchQuery) // Filtra pelo UID
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
      }

      setFilteredUsers(users);
    }
  };

  // Exibe os resultados ao clicar em "Ver Resultados"
  const viewResults = async (userId) => {
    const userData = await getUserData(userId);
    if (userData) {
      setSelectedUser(userData);
      setResults({
        pontuacaoAnsiedade: userData.pontuacaoAnsiedade || "N/A",
        pontuacaoDepressao: userData.pontuacaoDepressao || "N/A",
        respostas: userData,
      });
    }
  };

  if (!user) {
    return <div>Aguarde...</div>;
  }

  return (
    <div>
      <h1>Bem Estar - Admin</h1>
      <h2>Bem Vindo, {user.email}</h2>

      {/* Área de busca */}
      <div>
        <input
          type="text"
          placeholder="Search by email, name, or UID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {/* Lista de usuários filtrados */}
      <ul>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id}>
              {user.email || user.nome} -{" "}
              <button onClick={() => viewResults(user.id)}>Ver Resultados</button>
            </li>
          ))
        ) : (
          <li>Usuário não encontrado</li>
        )}
      </ul>

      {/* Exibe os resultados do usuário selecionado */}
      {selectedUser && results && (
        <div>
          <h2>Resultados de {selectedUser.nome || selectedUser.email}</h2>
          <p>Pontuação de Ansiedade: {results.pontuacaoAnsiedade}</p>
          <p>Pontuação de Depressão: {results.pontuacaoDepressao}</p>

          {/* Exibe as respostas separadas em duas colunas */}
          <h3>Respostas Individuais</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div>
              <h4>Ansiedade</h4>
              <ul>
                {[1, 3, 5, 7, 9, 11, 13].map((i) => (
                  <li key={`pergunta-${i}`}>
                    Pergunta {i}: {results.respostas[`pergunta-${i.toString().padStart(2, '0')}`] || "0"}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Depressão</h4>
              <ul>
                {[2, 4, 6, 8, 10, 12, 14].map((i) => (
                  <li key={`pergunta-${i}`}>
                    Pergunta {i}: {results.respostas[`pergunta-${i.toString().padStart(2, '0')}`] || "0"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
