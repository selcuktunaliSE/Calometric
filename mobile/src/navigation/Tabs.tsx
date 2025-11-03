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
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Calometric" }} />
      <Tab.Screen name="AddTab" component={AddFoodScreen} options={{ title: "Ekle" }} />
      <Tab.Screen name="HistoryTab" component={HistoryScreen} options={{ title: "Kayıtlar" }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}
