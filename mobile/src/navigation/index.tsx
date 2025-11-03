// src/navigation/index.tsx
import React from "react";
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs, { TabsParamList } from "./Tabs"; 
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { useAuth } from "../context/AuthContext";
import { Image, Pressable } from "react-native";

type RootStackParamList = {
  App: NavigatorScreenParams<TabsParamList>; 
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      {token ? (
        <Stack.Navigator>
          <Stack.Screen
            name="App"
            component={Tabs}
            options={({ navigation }) => ({
              headerTitle: () => (
                <Pressable onPress={() => navigation.navigate("App", { screen: "HomeTab" })}>
                  <Image
                    source={require("../assets/logo.svg")}
                    style={{ width: 120, height: 28, resizeMode: "contain" }}
                  />
                </Pressable>
              ),
              headerTitleAlign: "center",
            })}
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
