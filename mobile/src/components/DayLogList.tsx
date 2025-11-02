// src/components/DayLogList.tsx
import { View, Text, StyleSheet, FlatList } from 'react-native';
import type { FoodLogItem } from '../types/api';

export default function DayLogList({ data }:{ data: FoodLogItem[] }) {
  const render = ({item}: {item: FoodLogItem}) => (
    <View style={styles.row}>
      <View style={{flex:1}}>
        <Text style={styles.food}>{item.foodName}{item.brand ? ` • ${item.brand}`:''}</Text>
        <Text style={styles.meta}>{item.mealType} • {item.amountG} g</Text>
      </View>
      <Text style={styles.kcal}>{item.kcal} kcal</Text>
    </View>
  );
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bugünkü Kayıtlar</Text>
      <FlatList
        data={data}
        keyExtractor={(x)=>x.id}
        renderItem={render}
        ItemSeparatorComponent={()=><View style={{height:10}}/>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  card:{ backgroundColor:'#0b1020', borderRadius:16, padding:16, gap:12 },
  title:{ color:'#9aa4c2', fontSize:14 },
  row:{ flexDirection:'row', alignItems:'center' },
  food:{ color:'#fff', fontSize:16, fontWeight:'600' },
  meta:{ color:'#9aa4c2', fontSize:12, marginTop:2 },
  kcal:{ color:'#fff', fontWeight:'700' }
});
