import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory-native";
import { api } from "../lib/api";

function rangeIso(days=7){ const end=new Date(); end.setHours(0,0,0,0); const start=new Date(end); start.setDate(end.getDate()-days); return {start:start.toISOString(), end:end.toISOString()}; }

export default function HistoryScreen() {
  const r = useMemo(() => rangeIso(7), []);
  const { data } = useQuery({ queryKey: ["range", r], queryFn: async () => (await api.get(`/stats/range?start=${r.start}&end=${r.end}`)).data });
  const series = Object.entries(data || {}).map(([d, v]: any) => ({ x: d.slice(5), y: v.kcal || 0 }));
  return (
    <View style={{ padding:16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Haftalık Kalori</Text>
      <VictoryChart domainPadding={8}><VictoryAxis/><VictoryBar data={series} x="x" y="y"/></VictoryChart>
    </View>
  );
}
