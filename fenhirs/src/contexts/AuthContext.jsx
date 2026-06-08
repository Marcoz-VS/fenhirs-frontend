import { createContext, useEffect, useState } from "react";

import { api } from "../services/api";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("@token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  async function login(email, password) {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("@token", token);

      setUser(user);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error(error);
    }
  }

  function logout() {
    localStorage.removeItem("@token");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
