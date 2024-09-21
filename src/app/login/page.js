"use client";
import { useState } from "react";
import { auth } from "../../../firebase"; // Ajuste o caminho conforme necessário
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { button, container,  a, h1, h2 } from  '../globals.css'

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [resetMessage, setResetMessage] = useState("");
  const router = useRouter();


    

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin"); // Redireciona para a página de admin após login
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Email de recuperação enviado!");
    } catch (error) {
      setError("Não foi possível enviar o email de recuperação.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {error && <p className="error">{error}</p>}
        {resetMessage && <p className="success">{resetMessage}</p>}
      </form>
      <p>
        <a onClick={handlePasswordReset}>Esqueceu a senha?</a>
      </p>
    </div>
  );
}
export default LoginPage;
