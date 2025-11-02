// src/components/CaloriesCard.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function CaloriesCard({ consumed, target }:{
  consumed: number; target: number;
}) {
  const pct = Math.min(100, Math.round((consumed / Math.max(target,1)) * 100));
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Bugün</Text>
      <Text style={styles.kcal}>{consumed} / {target} kcal</Text>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.sub}>Hedefe {Math.max(target - consumed, 0)} kcal kaldı</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card:{ backgroundColor:'#0b1020', borderRadius:16, padding:16, gap:8 },
  title:{ color:'#9aa4c2', fontSize:14 },
  kcal:{ color:'#fff', fontSize:22, fontWeight:'700' },
  bar:{ height:10, backgroundColor:'#1a2340', borderRadius:8, overflow:'hidden' },
  fill:{ height:'100%', backgroundColor:'#16a34a' },
  sub:{ color:'#9aa4c2', fontSize:12 }
});
