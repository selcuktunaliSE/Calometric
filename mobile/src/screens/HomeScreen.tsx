import React, { useMemo } from "react";
import { View, Text, Button } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useNavigation } from "@react-navigation/native";

function todayIsoStart(){ const d=new Date(); d.setHours(0,0,0,0); return d.toISOString(); }

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const date = useMemo(todayIsoStart, []);
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: async () => (await api.get("/profile/me")).data });
  const { data: sum } = useQuery({ queryKey: ["day", date], queryFn: async () => (await api.get(`/stats/day?date=${date}`)).data });

  const total = sum?.kcal ?? 0;
  const limit = me?.goals?.dailyCalories ?? 0;
  const remaining = limit ? Math.max(0, limit - total) : null;

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Bugün</Text>
      <Text>Kalori: {total} {limit ? `/ ${limit} kcal` : ""}</Text>
      {remaining !== null && <Text>Kalan: {remaining} kcal</Text>}
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button title="Yemek Ekle" onPress={() => nav.navigate("AddFood")} />
        <Button title="Profil" onPress={() => nav.navigate("Profile")} />
        <Button title="Geçmiş" onPress={() => nav.navigate("History")} />
      </View>
    </View>
  );
}
