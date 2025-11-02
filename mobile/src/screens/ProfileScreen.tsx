// src/screens/ProfileScreen.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../features/home/api';

export default function ProfileScreen() {
  const q = useQuery({ queryKey:['meProfile'], queryFn:getProfile });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil & Analiz</Text>
      {q.data && (
        <View style={styles.card}>
          <Text style={styles.line}>Cinsiyet: <Text style={styles.val}>{q.data.gender}</Text></Text>
          <Text style={styles.line}>Yaş: <Text style={styles.val}>{q.data.age}</Text></Text>
          <Text style={styles.line}>Boy: <Text style={styles.val}>{q.data.heightCm} cm</Text></Text>
          <Text style={styles.line}>Kilo: <Text style={styles.val}>{q.data.weightKg} kg</Text></Text>
          <Text style={styles.line}>BMI: <Text style={styles.val}>{q.data.bmi.toFixed(2)}</Text></Text>
          <Text style={styles.line}>BMR: <Text style={styles.val}>{Math.round(q.data.bmr)} kcal</Text></Text>
          <Text style={styles.line}>TDEE: <Text style={styles.val}>{Math.round(q.data.tdee)} kcal</Text></Text>
          <Text style={styles.line}>Hedef: <Text style={styles.val}>{q.data.goalKcal} kcal/gün</Text></Text>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#070b18', padding:16, gap:12 },
  title:{ color:'#fff', fontSize:18, fontWeight:'700' },
  card:{ backgroundColor:'#0b1020', borderRadius:16, padding:16, gap:8 },
  line:{ color:'#9aa4c2' },
  val:{ color:'#fff', fontWeight:'700' }
});
