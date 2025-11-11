# Mobile Snapshot ( 3 Kas 2025 Pts +03 23:11:43)


## package.json (mobile) — `mobile/package.json`

```json
{
  "name": "mobile",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-picker/picker": "^2.11.4",
    "@react-navigation/bottom-tabs": "^7.7.3",
    "@react-navigation/native": "^7.1.19",
    "@react-navigation/native-stack": "^7.6.2",
    "@tanstack/react-query": "^5.90.6",
    "axios": "^1.13.1",
    "expo": "~54.0.20",
    "expo-constants": "~18.0.10",
    "expo-secure-store": "~15.0.7",
    "expo-status-bar": "~3.0.8",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "victory": "^37.3.6",
    "victory-native": "^41.20.1"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "babel-preset-expo": "^54.0.6",
    "expo-module-scripts": "^3.5.4",
    "metro-react-native-babel-transformer": "^0.77.0",
    "react-native-svg-transformer": "^1.5.1",
    "typescript": "~5.9.2"
  },
  "private": true
}
```


## app.config.ts — `mobile/app.config.ts`

```ts
export default {
  expo: {
    name: "Calometric",
    slug: "calometric",
    scheme: "calometric",
    extra: {
      apiUrl: process.env.API_URL ?? "http://localhost:5001",
    },
  },
};
```


## app.json — `mobile/app.json`

```json
{
  "expo": {
    "name": "mobile",
    "slug": "mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store"
    ]
  }
}
```


## tsconfig.json (mobile) — `mobile/tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```


## metro.config.js — `mobile/metro.config.js`

```js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// SVG'yi JS kaynağı gibi işlemek için transformer:
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

// "svg" artık asset değil "source"
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = config;
```


## babel.config.js — `mobile/babel.config.js`

```js
module.exports = function (api) {
  api.cache(true);
  return { presets: ["babel-preset-expo"] };
};
```


## api.ts — `mobile/src/api.ts`

```ts
import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const baseURL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Constants?.expoConfig?.extra as any)?.apiUrl ||
  "http://localhost:5001";

export const api = axios.create({ baseURL });

api.interceptors.request.use(async (cfg) => {
  const t = await SecureStore.getItemAsync("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
```


## AuthContext — `mobile/src/context/AuthContext.tsx`

```tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { getToken, setToken, clearToken } from "../storage";

type AuthCtx = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTok] = useState<string | null>(null);

  useEffect(() => {
    getToken().then((t) => t && setTok(t));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    await setToken(data.token);
    setTok(data.token);
  };

  const register = async (email: string, password: string) => {
    const { data } = await api.post("/auth/register", { email, password });
    await setToken(data.token);
    setTok(data.token);
  };

  const logout = async () => {
    await clearToken();
    setTok(null);
  };

  // ✅ ÇÖZÜM: value’yu stabilize et
  const value = useMemo(
    () => ({ token, login, register, logout }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```


## Navigation index — `mobile/src/navigation/index.tsx`

```tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useAuth } from "../context/AuthContext";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { token } = useAuth();

  return (
    <NavigationContainer theme={{
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#070b18",  // senin app arka plan rengin
    card: "#0b1020",        // header veya card arka planı
    text: "#ffffff",        // metin rengi
    border: "#222",         // kenarlıklar
  },
}}>
      {token ? (
        <Stack.Navigator>
          <Stack.Screen
            name="App"
            component={Tabs}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
```


## Tabs — `mobile/src/navigation/tabs.tsx`

```tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import AddFoodScreen from "../screens/AddFoodScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";

export type TabsParamList = {
  HomeTab: undefined;
  AddTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ focused, size }) => {
          const color = focused ? "#111" : "#888";
          switch (route.name) {
            case "HomeTab": return <Ionicons name="home-outline" size={size} color={color} />;
            case "AddTab": return <Ionicons name="add-circle-outline" size={size} color={color} />;
            case "HistoryTab": return <Ionicons name="list-outline" size={size} color={color} />;
            case "ProfileTab": return <Ionicons name="person-outline" size={size} color={color} />;
            default: return null;
          }
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Anasayfa" }} />
      <Tab.Screen name="AddTab" component={AddFoodScreen} options={{ title: "Ekle" }} />
      <Tab.Screen name="HistoryTab" component={HistoryScreen} options={{ title: "Kayıtlar" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}
```


## HomeScreen — `mobile/src/screens/HomeScreen.tsx`

```tsx
import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTodaySummary, getTodayLogs } from '../features/home/api';
import { useNavigation } from '@react-navigation/native';
import CaloriesCard from '../components/CaloriesCard';
import MacrosStrip from '../components/MacrosStrip';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const qSummary = useQuery({ queryKey: ['todaySummary'], queryFn: getTodaySummary });
  const qLogs = useQuery({ queryKey: ['todayLogs'], queryFn: getTodayLogs });

  const header = (
    <View style={{ gap: 16 }}>
      <CaloriesCard
        consumed={qSummary.data?.totals.kcal ?? 0}
        target={qSummary.data?.targetKcal ?? 0}
      />
      <MacrosStrip
        carbG={qSummary.data?.totals.carbG ?? 0}
        proteinG={qSummary.data?.totals.proteinG ?? 0}
        fatG={qSummary.data?.totals.fatG ?? 0}
      />
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={header}
      data={qLogs.data ?? []}
      keyExtractor={(x) => x.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.logItem}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <Text style={styles.kcal}>{item.kcal} kcal</Text>
        </View>
      )}
      ListFooterComponent={
        <TouchableOpacity style={styles.addBtn} onPress={() => nav.navigate('AddFood')}>
          <Text style={styles.addText}>+ Yiyecek Ekle</Text>
        </TouchableOpacity>
      }
      contentContainerStyle={{ padding: 16, backgroundColor: '#070b18' }}
    />
  );
}

const styles = StyleSheet.create({
  logItem: { padding: 8, borderBottomWidth: 0.5, borderColor: '#222' },
  foodName: { color: '#fff', fontSize: 16 },
  kcal: { color: '#9aa4c2', fontSize: 14 },
  addBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  addText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
```


## DayLogList — `mobile/src/components/DayLogList.tsx`

```tsx
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
```


## home/api — `mobile/src/features/home/api.ts`

```ts
import { api } from '../../api';
import { DaySummary, WeekSummaryPoint, FoodLogItem, ProfileDTO } from '../../types/api';

export const getTodaySummary = async (): Promise<DaySummary> => {
  const { data } = await api.get('/summary/today');  // uyumlu
  return data;
};

export const getTodayLogs = async (): Promise<FoodLogItem[]> => {
  const { data } = await api.get('/logs/today');     // yeni eklendi
  return data;
};

export const getWeekSummary = async (): Promise<WeekSummaryPoint[]> => {
  const { data } = await api.get('/summary/week');   // uyumlu
  return data;
};

export const getProfile = async (): Promise<ProfileDTO> => {
  const { data } = await api.get('/me/profile');     // uyumlu
  return data;
};
```


## types/api — `mobile/src/types/api.ts`

```ts
export type MacroTotals = {
  kcal: number;
  carbG: number;
  proteinG: number;
  fatG: number;
};

export type DaySummary = {
  date: string;          // 'YYYY-MM-DD'
  totals: MacroTotals;
  targetKcal: number;    // Goal.dailyCalories
};

export type WeekSummaryPoint = {
  date: string;          // 'YYYY-MM-DD'
  kcal: number;
};

export type ProfileDTO = {
  gender: "male" | "female";
  age: number;
  heightCm: number;
  weightKg: number;
  activity: "sedentary" | "light" | "moderate" | "high" | "athlete";
  bmi: number;
  bmr: number;
  tdee: number;
  goalKcal: number | null;
};

export type FoodLogItem = {
  id: string;
  foodName: string;
  brand?: string | null;
  amountG: number;
  kcal: number;
  carbG: number;
  proteinG: number;
  fatG: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
};
```


Done → mobile_snapshot.md
