import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import api from "../api/client";

function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function HomeScreen({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [me, setMe] = useState(null);

  const loadData = async () => {
    const meRes = await api.get("/user/me");
    setMe(meRes.data);

    const sumRes = await api.get("/diary/summary", {
      params: { date: todayStr() },
    });
    setSummary(sumRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const dailyCalories = me?.calorieTarget;
  const totalToday = summary ? Number(summary.total_calories) : 0;
  const remaining = dailyCalories ? dailyCalories - totalToday : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bugün</Text>

      {me && (
        <View style={styles.card}>
          <Text style={styles.label}>BMI: <Text style={styles.value}>{me.bmi}</Text></Text>
          <Text style={styles.label}>
            Günlük Hedef Kalori:{" "}
            <Text style={styles.value}>{dailyCalories || "-"}</Text>
          </Text>
        </View>
      )}

      {summary && (
        <View style={styles.card}>
          <Text style={styles.label}>
            Alınan Kalori: <Text style={styles.value}>{totalToday.toFixed(0)} kcal</Text>
          </Text>
          {remaining != null && (
            <Text
              style={[
                styles.label,
                remaining < 0 ? styles.over : styles.ok,
              ]}
            >
              Kalan: {remaining.toFixed(0)} kcal
            </Text>
          )}
          <Text style={styles.macro}>
            Karb: {Number(summary.total_carbs).toFixed(1)} g
          </Text>
          <Text style={styles.macro}>
            Protein: {Number(summary.total_protein).toFixed(1)} g
          </Text>
          <Text style={styles.macro}>
            Yağ: {Number(summary.total_fat).toFixed(1)} g
          </Text>
        </View>
      )}

      <Button title="Yemek Ekle" onPress={() => navigation.navigate("AddEntry", { date: todayStr() })} />
      <View style={{ height: 10 }} />
      <Button title="Çıkış Yap" color="red" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 15 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  label: { fontSize: 16, marginBottom: 4 },
  value: { fontWeight: "bold" },
  macro: { fontSize: 14 },
  over: { color: "red" },
  ok: { color: "green" },
});