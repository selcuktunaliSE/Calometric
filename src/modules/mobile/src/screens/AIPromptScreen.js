import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import UnitPicker from "../components/UnitPicker";
import { gramsFor } from "../lib/units";
import { api } from "../services/api";

// Basit yerel ayrıştırma (backend /ai/parse yoksa fallback)
function localParse(text){
  // "2 dilim tam buğday ekmek, 1 kase mercimek çorbası" gibi girdileri parse eder
  const norm = s => s.toLowerCase()
    .replaceAll(" yemek kaşığı"," yemek_kaşığı")
    .replaceAll(" tatlı kaşığı"," tatlı_kaşığı")
    .replaceAll(" çay kaşığı"," çay_kaşığı")
    .replaceAll(" su bardağı"," su_bardağı")
    .replaceAll(",", " , ");
  const parts = norm(text).split(",").map(t=>t.trim()).filter(Boolean);
  const re = /^(\d+(?:[.,]\d+)?)\s*(g|ml|adet|dilim|kase|porsiyon|yemek_kaşığı|tatlı_kaşığı|çay_kaşığı|su_bardağı)?\s*(.*)$/i;
  const items = parts.map(p=>{
    const m = p.match(re);
    if(!m) return null;
    const qty = parseFloat((m[1]||"1").replace(",", ".")) || 1;
    const unit = (m[2]||"g").toLowerCase();
    const name = (m[3]||"").trim() || "gıda";
    const grams = unit==="g" ? qty : gramsFor(name, qty, unit);
    return { original:p, std_name:name, quantity:qty, unit, grams,
      kcal:0, carbG:0, proteinG:0, fatG:0, notFound:true };
  }).filter(Boolean);
  return { items, total: items.reduce((a,r)=>({kcal:a.kcal+r.kcal,carbG:a.carbG+r.carbG,proteinG:a.proteinG+r.proteinG,fatG:a.fatG+r.fatG}), {kcal:0,carbG:0,proteinG:0,fatG:0}) };
}

export default function AIPromptScreen(){
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]); // {std_name,quantity,unit,grams,kcal,...}

  async function onPlus(){
    if(!text.trim()) return;
    setLoading(true);
    try {
      // Backend varsa deneyelim:
      const { data } = await api.post("/ai/parse", { text });
      const mapped = (data.items||[]).map(it=>{
        const grams = it.unit==="g" ? it.quantity : (it.grams ?? gramsFor(it.std_name, it.quantity, it.unit));
        return { ...it, grams };
      });
      setItems(mapped);
    } catch(e) {
      // Fallback: yerel parse
      const { items:localItems } = localParse(text);
      setItems(localItems);
      Alert.alert("Uyarı", "Sunucu /ai/parse yanıt vermedi. Yerel tahminle dolduruldu.");
    } finally {
      setLoading(false);
    }
  }

  const totals = useMemo(()=>{
    let kcal=0,carbG=0,proteinG=0,fatG=0;
    for(const it of items){
      if(it.kcal && it.grams){
        const pg = it.kcal/it.grams, cg=(it.carbG||0)/it.grams, pr=(it.proteinG||0)/it.grams, fg=(it.fatG||0)/it.grams;
        kcal += Math.round(pg*it.grams);
        carbG += +(cg*it.grams).toFixed(1);
        proteinG += +(pr*it.grams).toFixed(1);
        fatG += +(fg*it.grams).toFixed(1);
      }
    }
    return {kcal,carbG,proteinG,fatG};
  }, [items]);

  function onChangeQty(i, v){
    const q = Number(String(v).replace(",", ".")) || 0;
    setItems(prev=>{
      const arr=[...prev];
      const it = {...arr[i]};
      it.quantity = q;
      it.grams = it.unit==="g" ? q : gramsFor(it.std_name, q, it.unit);
      arr[i]=it; return arr;
    });
  }
  function onChangeUnit(i, u){
    setItems(prev=>{
      const arr=[...prev];
      const it = {...arr[i]};
      it.unit = u;
      it.grams = u==="g" ? it.quantity : gramsFor(it.std_name, it.quantity, u);
      arr[i]=it; return arr;
    });
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Yediğini Yaz</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Örn: 2 dilim tam buğday ekmek, 1 kase mercimek çorbası..."
        multiline
        style={s.input}
      />
      <View style={s.actions}>
        <TouchableOpacity style={s.addBtn} onPress={onPlus} disabled={loading || !text.trim()}>
          {loading ? <ActivityIndicator color="#fff"/> : <Text style={s.addBtnText}>＋</Text>}
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(_,i)=>String(i)}
        contentContainerStyle={{paddingBottom:120}}
        renderItem={({item,index})=>(
          <View style={s.card}>
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
              <Text style={s.cardTitle}>{item.resolved_name || item.std_name}</Text>
              {item.confidence!=null && <Text style={s.conf}>≈{Math.round(item.confidence*100)}%</Text>}
            </View>

            <View style={s.row}>
              <View style={{flex:1}}>
                <Text style={s.label}>Miktar</Text>
                <TextInput
                  keyboardType="numeric"
                  value={String(item.quantity ?? 0)}
                  onChangeText={(v)=>onChangeQty(index, v)}
                  style={s.qty}
                />
              </View>

              <View style={{width:170, marginLeft:12}}>
                <Text style={s.label}>Birim</Text>
                <UnitPicker value={item.unit || "g"} onChange={(u)=>onChangeUnit(index, u)} />
              </View>

              <View style={{marginLeft:12, alignItems:"flex-end"}}>
                <Text style={s.label}>Gram</Text>
                <Text style={s.grams}>{Math.round(item.grams || 0)} g</Text>
              </View>
            </View>

            <View style={s.macros}>
              <Pill label="kcal" value={item.kcal ? Math.round(item.kcal) : 0}/>
              <Pill label="C" value={item.carbG ? +(+item.carbG).toFixed(1) : 0}/>
              <Pill label="P" value={item.proteinG ? +(+item.proteinG).toFixed(1) : 0}/>
              <Pill label="F" value={item.fatG ? +(+item.fatG).toFixed(1) : 0}/>
            </View>

            {item.notFound && <Text style={s.warn}>Makrolar için eşleşme yok (sadece gram hesaplandı)</Text>}
          </View>
        )}
      />

      {!!items.length && (
        <View style={s.footer}>
          <Text style={s.total}>
            Toplam: {totals.kcal} kcal • C {totals.carbG}g • P {totals.proteinG}g • F {totals.fatG}g
          </Text>
        </View>
      )}
    </View>
  );
}

function Pill({label, value}) {
  return (
    <View style={s.pill}>
      <Text style={s.pillLabel}>{label}</Text>
      <Text style={s.pillVal}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:"#fff"},
  title:{fontSize:20,fontWeight:"700",marginBottom:8},
  input:{minHeight:80,borderWidth:1,borderColor:"#E5E7EB",borderRadius:12,padding:12,fontSize:16},
  actions:{flexDirection:"row",justifyContent:"flex-end",marginTop:8},
  addBtn:{width:44,height:44,borderRadius:22,backgroundColor:"#0E1B2E",alignItems:"center",justifyContent:"center"},
  addBtnText:{color:"#fff",fontSize:28,lineHeight:28,marginTop:-2},
  card:{borderWidth:1,borderColor:"#E5E7EB",borderRadius:14,padding:12,marginTop:12},
  cardTitle:{fontSize:16,fontWeight:"600"},
  conf:{color:"#6B7280",fontSize:12},
  row:{flexDirection:"row",alignItems:"center",marginTop:8},
  label:{color:"#6B7280",fontSize:12,marginBottom:6},
  qty:{borderWidth:1,borderColor:"#E5E7EB",borderRadius:8,paddingHorizontal:10,paddingVertical:8,fontSize:16},
  grams:{fontSize:16,fontWeight:"600"},
  macros:{flexDirection:"row",gap:8,marginTop:10,flexWrap:"wrap"},
  pill:{backgroundColor:"#F3F4F6",borderRadius:999,paddingHorizontal:10,paddingVertical:6,flexDirection:"row",alignItems:"center",gap:6},
  pillLabel:{color:"#6B7280",fontSize:12},
  pillVal:{fontSize:14,fontWeight:"600"},
  warn:{color:"#FF6B6B",marginTop:8},
  footer:{position:"absolute",left:0,right:0,bottom:0,padding:12,borderTopWidth:1,borderColor:"#E5E7EB",backgroundColor:"#fff"},
  total:{fontSize:15,fontWeight:"600"}
});
