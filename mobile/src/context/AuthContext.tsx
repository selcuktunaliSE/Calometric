import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { getToken, setToken, clearToken } from "../lib/storage";

type AuthCtx = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthCtx>({} as any);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTok] = useState<string | null>(null);
  useEffect(() => { getToken().then(t => t && setTok(t)); }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    await setToken(data.token);
    setTok(data.token);
  };
  const logout = async () => { await clearToken(); setTok(null); };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};
