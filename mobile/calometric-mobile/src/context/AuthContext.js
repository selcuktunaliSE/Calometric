import React, { createContext, useState, useEffect } from "react";
import api, { setAuthToken } from "../api/client";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const storedToken = await SecureStore.getItemAsync("calometric_token");
      if (storedToken) {
        setAuthToken(storedToken);
        setTokenState(storedToken);
        try {
          const res = await api.get("/user/me");
          setUser(res.data);
        } catch (e) {
          console.log("Auto login failed", e.message);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: jwt, user } = res.data;
    setAuthToken(jwt);
    setTokenState(jwt);
    setUser(user);
    await SecureStore.setItemAsync("calometric_token", jwt);
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    const { token: jwt, user } = res.data;
    setAuthToken(jwt);
    setTokenState(jwt);
    setUser(user);
    await SecureStore.setItemAsync("calometric_token", jwt);
  };

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
    setTokenState(null);
    await SecureStore.deleteItemAsync("calometric_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}