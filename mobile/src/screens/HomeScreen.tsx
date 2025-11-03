import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTodaySummary, getTodayLogs } from '../features/home/api';
import { useNavigation } from '@react-navigation/native';
import CaloriesCard from '../components/CaloriesCard';
import MacrosStrip from '../components/MacrosStrip';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const qSummary = useQuery({ queryKey: ['todaySummary'], queryFn: getTodaySummary });
  const qLogs = useQuery({ queryKey: ['todayLogs'], queryFn: getTodayLogs });

  const header = (
    <View style={{ gap: 16 }}>
      <CaloriesCard
        consumed={qSummary.data?.totals.kcal ?? 0}
        target={qSummary.data?.targetKcal ?? 0}
      />
      <MacrosStrip
        carbG={qSummary.data?.totals.carbG ?? 0}
        proteinG={qSummary.data?.totals.proteinG ?? 0}
        fatG={qSummary.data?.totals.fatG ?? 0}
      />
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={header}
      data={qLogs.data ?? []}
      keyExtractor={(x) => x.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.logItem}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <Text style={styles.kcal}>{item.kcal} kcal</Text>
        </View>
      )}
      ListFooterComponent={
        <TouchableOpacity style={styles.addBtn} onPress={() => nav.navigate('AddFood')}>
          <Text style={styles.addText}>+ Yiyecek Ekle</Text>
        </TouchableOpacity>
      }
      contentContainerStyle={{ padding: 16, backgroundColor: '#070b18' }}
    />
  );
}

const styles = StyleSheet.create({
  logItem: { padding: 8, borderBottomWidth: 0.5, borderColor: '#222' },
  foodName: { color: '#fff', fontSize: 16 },
  kcal: { color: '#9aa4c2', fontSize: 14 },
  addBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  addText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
