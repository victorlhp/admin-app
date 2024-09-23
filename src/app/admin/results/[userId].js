"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

const ResultsPage = ({ params }) => {
  const { userId } = params; // 'params' captura o ID da URL dinâmica
  const [userResults, setUserResults] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      const docRef = doc(db, "usuarios", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserResults(docSnap.data());
      } else {
        console.log("Documento não encontrado!");
      }
    };

    fetchResults();
  }, [userId]);

  if (!userResults) {
    return <div>Carregando resultados...</div>;
  }

  return (
    <div>
      <h1>Resultados de {userResults.email || userResults.nome}</h1>
      <p>Pontuação de Ansiedade: {userResults.pontuacaoAnsiedade}</p>
      <p>Pontuação de Depressão: {userResults.pontuacaoDepressao}</p>
      {/* Adicione mais detalhes dos resultados aqui, como respostas separadas */}
    </div>
  );
};

export default ResultsPage;
