import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");
  const [loading,setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.includes("@")) return Alert.alert("Hata","Geçerli bir e-posta gir.");
    if (password.length < 6) return Alert.alert("Hata","Şifre en az 6 karakter.");
    if (password !== confirm) return Alert.alert("Hata","Şifreler uyuşmuyor.");
    try {
      setLoading(true);
      await register(email.trim(), password);
    } catch (e: any) {
      Alert.alert("Hata", e?.response?.data?.error ?? "Kayıt başarısız.");
    } finally { setLoading(false); }
  };

  return (
    <View style={{ flex:1, backgroundColor:"#0A0A0A", padding:24, justifyContent:"center" }}>
      <Text style={{ fontSize:26, color:"#F3F4F6", fontWeight:"800", marginBottom:16 }}>Yeni Hesap</Text>
      <Text style={{ color:"#9CA3AF", marginBottom:8 }}>E-posta</Text>
      <TextInput
        value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
        placeholder="ornek@eposta.com" placeholderTextColor="#6B7280"
        style={{ backgroundColor:"#111827", color:"#F3F4F6", padding:14, borderRadius:12, borderWidth:1, borderColor:"#1F2937", marginBottom:12 }}
      />
      <Text style={{ color:"#9CA3AF", marginBottom:8 }}>Şifre</Text>
      <TextInput
        value={password} onChangeText={setPassword} secureTextEntry
        placeholder="••••••" placeholderTextColor="#6B7280"
        style={{ backgroundColor:"#111827", color:"#F3F4F6", padding:14, borderRadius:12, borderWidth:1, borderColor:"#1F2937", marginBottom:12 }}
      />
      <Text style={{ color:"#9CA3AF", marginBottom:8 }}>Şifre (tekrar)</Text>
      <TextInput
        value={confirm} onChangeText={setConfirm} secureTextEntry
        placeholder="••••••" placeholderTextColor="#6B7280"
        style={{ backgroundColor:"#111827", color:"#F3F4F6", padding:14, borderRadius:12, borderWidth:1, borderColor:"#1F2937" }}
      />
      <TouchableOpacity
        onPress={onSubmit} disabled={loading}
        style={{ backgroundColor:"#60A5FA", padding:14, borderRadius:12, marginTop:16, alignItems:"center" }}>
        {loading ? <ActivityIndicator color="#0A0A0A"/> : <Text style={{ color:"#0A0A0A", fontWeight:"700" }}>Kayıt Ol</Text>}
      </TouchableOpacity>
    </View>
  );
}
