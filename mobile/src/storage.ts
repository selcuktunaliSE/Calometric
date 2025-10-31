import * as SecureStore from "expo-secure-store";
export const setToken = (t: string) => SecureStore.setItemAsync("token", t);
export const getToken = () => SecureStore.getItemAsync("token");
export const clearToken = () => SecureStore.deleteItemAsync("token");
