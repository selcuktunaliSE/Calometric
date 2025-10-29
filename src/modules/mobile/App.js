import React, { useState } from 'react'
import { Button, ScrollView, Text, View } from 'react-native'
import axios from 'axios'

const BASE_URL = 'http://localhost:3001' // iOS Simulator

export default function App() {
  const [health, setHealth] = useState(null)

  const onCheck = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/health`)
      setHealth(data)
    } catch (e) {
      setHealth({ ok:false, error: String(e) })
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Calometric</Text>
      <Button title="Health Check" onPress={onCheck} />
      <View><Text>{health ? JSON.stringify(health) : '—'}</Text></View>
    </ScrollView>
  )
}
