import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UNITS } from "../lib/units";

export default function UnitPicker({ value, onChange }) {
  return (
    <View style={styles.wrap}>
      <Picker selectedValue={value} onValueChange={v=>onChange(v)} style={{height:40,width:160}}>
        {UNITS.map(u => <Picker.Item key={u} label={u} value={u} />)}
      </Picker>
    </View>
  );
}
const styles = StyleSheet.create({ wrap:{borderWidth:1,borderColor:"#E5E7EB",borderRadius:8,overflow:"hidden"} });
