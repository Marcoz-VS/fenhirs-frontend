import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";

export function Login() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    await login(email, password);

    navigate("/products");
  }

  return (
    <div>
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
      </form>
    </div>
  );
}
