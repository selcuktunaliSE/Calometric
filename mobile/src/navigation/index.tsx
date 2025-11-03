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
