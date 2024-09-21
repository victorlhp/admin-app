"use client"; // Adiciona isso no topo do arquivo

import { useState, useEffect } from "react";
import { auth, db } from "../../../firebase"; // Caminho relativo


import { collection, getDocs } from "firebase/firestore";

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "answers"));
        const answers = querySnapshot.docs.map((doc) => doc.data());
        setData(answers);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <h2>Welcome, {user.email}</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
