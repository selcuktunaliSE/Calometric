import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    gender: "female",
    height_cm: "",
    weight_kg: "",
  });
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    try {
      setError("");
      await register({
        email: form.email,
        password: form.password,
        name: form.name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      });
    } catch (e) {
      console.log(e.response?.data || e.message);
      setError("Kayıt başarısız. Email kullanımda olabilir.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={form.password}
        onChangeText={(v) => handleChange("password", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="İsim"
        value={form.name}
        onChangeText={(v) => handleChange("name", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Yaş"
        keyboardType="numeric"
        value={form.age}
        onChangeText={(v) => handleChange("age", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Cinsiyet (male/female)"
        value={form.gender}
        onChangeText={(v) => handleChange("gender", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Boy (cm)"
        keyboardType="numeric"
        value={form.height_cm}
        onChangeText={(v) => handleChange("height_cm", v)}
      />
      <TextInput
        style={styles.input}
        placeholder="Kilo (kg)"
        keyboardType="numeric"
        value={form.weight_kg}
        onChangeText={(v) => handleChange("weight_kg", v)}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Kayıt Ol" onPress={handleRegister} />

      <Text style={styles.link} onPress={() => navigation.goBack()}>
        Zaten hesabın var mı? Giriş yap
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  error: { color: "red", marginBottom: 10 },
  link: { color: "blue", marginTop: 15, textAlign: "center" },
});