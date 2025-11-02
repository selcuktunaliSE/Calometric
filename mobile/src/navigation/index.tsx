import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import AppLogo from "../components/AppLogo";
import AddFoodScreen from "../screens/AddFoodScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#0A0A0A",
    text: "#F3F4F6",
    card: "#111827",
    border: "#1F2937",
  },
};

export default function Navigation() {
  const { token } = useAuth();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerTitle: () => <AppLogo size={22} />,
          headerTitleAlign: "center",

        }}
      >
       {!token ? (
  <>
    <Stack.Screen name="Login" component={LoginScreen}/>
    <Stack.Screen name="Register" component={RegisterScreen} />
  </>
) : (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="AddFood" component={AddFoodScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </>
)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
