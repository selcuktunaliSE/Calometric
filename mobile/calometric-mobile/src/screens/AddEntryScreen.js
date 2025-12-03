import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import api from "../api/client";

export default function AddEntryScreen({ route, navigation }) {
  const { date } = route.params;
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [quantity, setQuantity] = useState("1");

  const handleSave = async () => {
    try {
      await api.post("/diary", {
        custom_name: name,
        custom_calories: calories ? Number(calories) : null,
        custom_carbs: carbs ? Number(carbs) : null,
        custom_protein: protein ? Number(protein) : null,
        custom_fat: fat ? Number(fat) : null,
        quantity: quantity ? Number(quantity) : 1,
        entry_date: date,
      });
      Alert.alert("Başarılı", "Kayıt eklendi");
      navigation.goBack();
    } catch (e) {
      console.log(e.response?.data || e.message);
      Alert.alert("Hata", "Kayıt eklenemedi");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yemek Ekle ({date})</Text>
      <TextInput
        style={styles.input}
        placeholder="Yemek adı"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Kalori (kcal)"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />
      <TextInput
        style={styles.input}
        placeholder="Karb (g)"
        keyboardType="numeric"
        value={carbs}
        onChangeText={setCarbs}
      />
      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />
      <TextInput
        style={styles.input}
        placeholder="Yağ (g)"
        keyboardType="numeric"
        value={fat}
      />
      <TextInput
        style={styles.input}
        placeholder="Adet / Porsiyon"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <Button title="Kaydet" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
});