import { createContext, useContext, useState } from "react";
import apiFetch from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async ({ email, password }) => {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  console.log("login response:", data);
  setUser(data);
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

const register = async ({ name, email, password, confirmPassword }) => {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: { name, email, password, confirmPassword },
  });

  // auto-login after register
  setUser(data);
  localStorage.setItem("user", JSON.stringify(data));
  return data;
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
