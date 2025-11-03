import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { getToken, setToken, clearToken } from "../storage";

type AuthCtx = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTok] = useState<string | null>(null);

  useEffect(() => {
    getToken().then((t) => t && setTok(t));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    await setToken(data.token);
    setTok(data.token);
  };

  const register = async (email: string, password: string) => {
    const { data } = await api.post("/auth/register", { email, password });
    await setToken(data.token);
    setTok(data.token);
  };

  const logout = async () => {
    await clearToken();
    setTok(null);
  };

  // ✅ ÇÖZÜM: value’yu stabilize et
  const value = useMemo(
    () => ({ token, login, register, logout }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
