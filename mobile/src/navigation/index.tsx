import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import AddFoodScreen from "../screens/AddFoodScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { token } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: "Giriş" }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Bugün" }} />
            <Stack.Screen name="AddFood" component={AddFoodScreen} options={{ title: "Yemek Ekle" }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ title: "Geçmiş" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
