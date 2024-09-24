"use client";
import { useState } from "react";
import { auth } from "../../../firebase"; // Ajuste o caminho conforme necessário
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import './login.css'; // Certifique-se de que o caminho está correto

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
      <div className="logo-container">
        <img src="/logoBemEstar.png" alt="Logomarca" className="logo" />
      </div>

      <h1>Bem Estar - Admin</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />
        <button type="submit" className="button-content">Entrar</button>
        {error && <p className="error">{error}</p>}
        {resetMessage && <p className="success">{resetMessage}</p>}
      </form>
      <p>
        <a onClick={handlePasswordReset} className="forgot-password-button-text">Esqueceu a senha?</a>
      </p>
    </div>
  );
};

export default LoginPage;
