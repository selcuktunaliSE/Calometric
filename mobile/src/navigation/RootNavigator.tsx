import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import { Image, Pressable } from "react-native";

export type RootStackParamList = {
  Root: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={Tabs}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Pressable onPress={() => navigation.navigate("Root", { screen: "HomeTab" } as any)}>
              {/* Kendi logonu buraya koy: */}
              <Image source={require("../assets/logo.png")} style={{ width: 120, height: 28, resizeMode: "contain" }} />
            </Pressable>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
