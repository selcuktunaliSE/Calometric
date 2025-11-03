import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants?.expoConfig?.extra as any)?.apiUrl ||
  "http://localhost:5001";

export const api = axios.create({ baseURL });

api.interceptors.request.use(async (cfg) => {
  const t = await SecureStore.getItemAsync("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
