import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuração do Firebase (substitua pelos seus próprios dados de configuração)
const firebaseConfig = {
    apiKey: "AIzaSyAHO7rhIrfypj-x27HetVym-08K9YmE22U",
    authDomain: "bem-estar-3fb2c.firebaseapp.com",
    databaseURL: "https://bem-estar-3fb2c-default-rtdb.firebaseio.com",
    projectId: "bem-estar-3fb2c",
    storageBucket: "bem-estar-3fb2c.appspot.com",
    messagingSenderId: "123743475693",
    appId: "1:123743475693:web:36043abf2701a929eff9e4",
    measurementId: "G-NFR3GLN5R7"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
