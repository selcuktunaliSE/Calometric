import React, { useState } from "react";
import { View, TextInput, FlatList, Text, Button, Alert } from "react-native";
import { api } from "../api";

export default function AddFoodScreen() {
  const [q, setQ] = useState("");
  const [foods, setFoods] = useState<any[]>([]);
  const [grams, setGrams] = useState("100");

  const search = async () => {
    const { data } = await api.get(`/food/search?q=${encodeURIComponent(q)}`);
    setFoods(data);
  };
  const add = async (foodId: string) => {
    const d = new Date(); d.setHours(0,0,0,0);
    const body = { foodId, date: d.toISOString(), mealType: "lunch", amountG: Number(grams) };
    const { data } = await api.post("/logs/add", body);
    if (data.exceeded) Alert.alert("Uyarı", `Günlük limit aşıldı! (${data.limit} kcal)`);
    else Alert.alert("Eklendi");
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <TextInput placeholder="Yemek ara" value={q} onChangeText={setQ} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}/>
      <Button title="Ara" onPress={search} />
      <TextInput placeholder="Gram" keyboardType="numeric" value={grams} onChangeText={setGrams}
                 style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}/>
      <FlatList
        data={foods}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 0.5 }}>
            <Text style={{ fontWeight: "600" }}>{item.name}</Text>
            <Text>{item.kcalPer100} kcal / 100g</Text>
            <Button title="Ekle" onPress={() => add(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
