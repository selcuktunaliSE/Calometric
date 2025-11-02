// src/components/MacrosStrip.tsx
import { View, Text, StyleSheet } from 'react-native';

export default function MacrosStrip({carbG, proteinG, fatG}:{carbG:number; proteinG:number; fatG:number}) {
  const total = Math.max(carbG + proteinG + fatG, 1);
  const carbPct = (carbG/total)*100, proPct=(proteinG/total)*100, fatPct=(fatG/total)*100;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Makro Dağılımı</Text>
      <View style={styles.strip}>
        <View style={[styles.block,{flex: carbG, backgroundColor:'#22c55e'}]} />
        <View style={[styles.block,{flex: proteinG, backgroundColor:'#3b82f6'}]} />
        <View style={[styles.block,{flex: fatG, backgroundColor:'#f59e0b'}]} />
      </View>
      <Text style={styles.legend}>
        Karb {carbG}g ({carbPct.toFixed(0)}%) • Protein {proteinG}g ({proPct.toFixed(0)}%) • Yağ {fatG}g ({fatPct.toFixed(0)}%)
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card:{ backgroundColor:'#0b1020', borderRadius:16, padding:16, gap:8 },
  title:{ color:'#9aa4c2', fontSize:14 },
  strip:{ height:12, borderRadius:8, overflow:'hidden', flexDirection:'row', backgroundColor:'#1a2340' },
  block:{ height:'100%' },
  legend:{ color:'#9aa4c2', fontSize:12, marginTop:6 }
});
