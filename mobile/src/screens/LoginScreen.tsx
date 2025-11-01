import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("a@a.com");
  const [password, setPassword] = useState("123456");

  const onRegister = async () => {
    try { await api.post("/auth/register", { email, password }); Alert.alert("Kayıt başarılı"); }
    catch { Alert.alert("Kayıt başarısız"); }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput placeholder="E-posta" autoCapitalize="none" value={email} onChangeText={setEmail}
                 style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
      <TextInput placeholder="Şifre" secureTextEntry value={password} onChangeText={setPassword}
                 style={{ borderWidth: 1, padding: 12, borderRadius: 8 }} />
      <Button title="Giriş" onPress={() => login(email, password).catch(()=>Alert.alert("Giriş başarısız"))} />
      <Button title="Kayıt Ol" onPress={onRegister} />
    </View>
  );
}
