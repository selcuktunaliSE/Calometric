import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { api } from "../lib/api";

export default function ProfileScreen() {
  const [gender, setGender] = useState<"male"|"female">("male");
  const [age, setAge] = useState("25");
  const [heightCm, setH] = useState("175");
  const [weightKg, setW] = useState("70");
  const [activity, setA] = useState<"sedentary"|"light"|"moderate"|"high"|"athlete">("moderate");
  const [goal, setGoal] = useState("2200");
  const [result, setResult] = useState<any>(null);

  const save = async () => {
    try {
      const body = {
        gender, age: Number(age), heightCm: Number(heightCm), weightKg: Number(weightKg),
        activity, goalDailyCalories: Number(goal),
      };
      const { data } = await api.post("/profile/save", body);
      setResult(data); Alert.alert("Kaydedildi");
    } catch { Alert.alert("Hata", "Profil kaydedilemedi"); }
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text>Cinsiyet (male/female)</Text>
      <TextInput value={gender} onChangeText={(t)=>setGender(t as any)} style={{ borderWidth:1, padding:8, borderRadius:8 }}/>
      <Text>Yaş</Text><TextInput value={age} onChangeText={setAge} keyboardType="numeric" style={{ borderWidth:1, padding:8, borderRadius:8 }}/>
      <Text>Boy (cm)</Text><TextInput value={heightCm} onChangeText={setH} keyboardType="numeric" style={{ borderWidth:1, padding:8, borderRadius:8 }}/>
      <Text>Kilo (kg)</Text><TextInput value={weightKg} onChangeText={setW} keyboardType="numeric" style={{ borderWidth:1, padding:8, borderRadius:8 }}/>
      <Text>Aktivite (sedentary/light/moderate/high/athlete)</Text>
      <TextInput value={activity} onChangeText={(t)=>setA(t as any)} style={{ borderWidth:1, padding:8, borderRadius:8 }}/>
      <Text>Günlük Kalori Hedefi</Text>
      <TextInput value={goal} onChangeText={setGoal} keyboardType="numeric" style={{ borderWidth:1, padding:8, borderRadius:8 }}/>
      <Button title="Kaydet & Hesapla" onPress={save} />
      {result && (
        <View style={{ marginTop: 12 }}>
          <Text>BMI: {result.bmi}</Text>
          <Text>BMR: {result.bmr}</Text>
          <Text>TDEE: {result.tdee}</Text>
        </View>
      )}
    </View>
  );
}
