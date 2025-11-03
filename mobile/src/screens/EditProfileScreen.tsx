import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { api } from '../api';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen() {
  const navigation = useNavigation();

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [activity, setActivity] = useState('light');

  const handleSubmit = async () => {
    try {
      const payload = {
        gender,
        age: parseInt(age),
        heightCm: parseFloat(heightCm),
        weightKg: parseFloat(weightKg),
        activity,
      };

      await api.post('/profile/save', payload);
      Alert.alert('Başarılı', 'Profil bilgileri kaydedildi.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Hata', 'Bilgiler kaydedilemedi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cinsiyet</Text>
      <Picker selectedValue={gender} onValueChange={(v) => setGender(v)}>
        <Picker.Item label="Erkek" value="male" />
        <Picker.Item label="Kadın" value="female" />
      </Picker>

      <Text style={styles.label}>Yaş</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} />

      <Text style={styles.label}>Boy (cm)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={heightCm} onChangeText={setHeightCm} />

      <Text style={styles.label}>Kilo (kg)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={weightKg} onChangeText={setWeightKg} />

      <Text style={styles.label}>Aktivite Seviyesi</Text>
      <Picker selectedValue={activity} onValueChange={(v) => setActivity(v)}>
        <Picker.Item label="Hafif" value="light" />
        <Picker.Item label="Orta" value="moderate" />
        <Picker.Item label="Yüksek" value="high" />
        <Picker.Item label="Atlet" value="athlete" />
        <Picker.Item label="Sedanter" value="sedentary" />
      </Picker>

      <Button title="Kaydet" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#070b18',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
    padding: 8,
    fontSize: 16,
  },
});
