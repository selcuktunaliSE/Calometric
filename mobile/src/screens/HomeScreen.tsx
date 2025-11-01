import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const { logout } = useAuth();
  return (
    <View style={{ flex:1, backgroundColor:"#0A0A0A", alignItems:"center", justifyContent:"center" }}>
      <Text style={{ color:"#F3F4F6", fontSize:22, fontWeight:"800", marginBottom:16 }}>Giriş başarılı 🎉</Text>
      <TouchableOpacity onPress={logout} style={{ backgroundColor:"#F87171", padding:12, borderRadius:10 }}>
        <Text style={{ color:"#0A0A0A", fontWeight:"700" }}>Çıkış yap</Text>
      </TouchableOpacity>
    </View>
  );
}
