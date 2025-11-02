import { View, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import CaloriesCard from '../components/CaloriesCard';
import MacrosStrip from '../components/MacrosStrip';
import DayLogList from '../components/DayLogList';
import { getTodaySummary, getTodayLogs } from '../features/home/api';
import { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  const qSummary = useQuery({ queryKey:['todaySummary'], queryFn:getTodaySummary });
  const qLogs    = useQuery({ queryKey:['todayLogs'], queryFn:getTodayLogs });

  const onRefresh = useCallback(async ()=>{
    setRefreshing(true);
    await Promise.all([qSummary.refetch(), qLogs.refetch()]);
    setRefreshing(false);
  },[qSummary, qLogs]);

  const consumed = qSummary.data?.totals.kcal ?? 0;
  const target   = qSummary.data?.targetKcal ?? 0;
  const carbG    = qSummary.data?.totals.carbG ?? 0;
  const proteinG = qSummary.data?.totals.proteinG ?? 0;
  const fatG     = qSummary.data?.totals.fatG ?? 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ gap:16, paddingBottom:24, paddingTop: '6%' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <CaloriesCard consumed={consumed} target={target} />
      <MacrosStrip carbG={carbG} proteinG={proteinG} fatG={fatG} />
      <DayLogList data={qLogs.data ?? []} />

      <TouchableOpacity style={styles.addBtn} onPress={()=>nav.navigate('AddFood')}>
        <Text style={styles.addText}>+ Yiyecek Ekle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, paddingHorizontal:16, backgroundColor:'#070b18' },
  addBtn:{ backgroundColor:'#16a34a', paddingVertical:14, borderRadius:12, alignItems:'center' },
  addText:{ color:'#fff', fontWeight:'700', fontSize:16 }
});
