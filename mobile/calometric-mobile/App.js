import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddEntryScreen from "./src/screens/AddEntryScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator>
      {user == null ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Giriş" }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Kayıt Ol" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Calometric" }} />
          <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ title: "Yemek Ekle" }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}