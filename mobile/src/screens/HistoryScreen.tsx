// src/screens/HistoryScreen.tsx
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getWeekSummary } from '../features/home/api';

export default function HistoryScreen() {
  const q = useQuery({ queryKey:['weekSummary'], queryFn:getWeekSummary });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Son 7 Gün</Text>
      <FlatList
        data={q.data ?? []}
        keyExtractor={(x)=>x.date}
        renderItem={({item})=>(
          <View style={styles.row}>
            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.kcal}>{item.kcal} kcal</Text>
          </View>
        )}
        ItemSeparatorComponent={()=> <View style={{height:10}}/>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#070b18', padding:16 },
  title:{ color:'#fff', fontSize:18, fontWeight:'700', marginBottom:12 },
  row:{ backgroundColor:'#0b1020', borderRadius:12, padding:12, flexDirection:'row', justifyContent:'space-between' },
  date:{ color:'#9aa4c2' },
  kcal:{ color:'#fff', fontWeight:'700' }
});
