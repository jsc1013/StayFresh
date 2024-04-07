import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { auth } from "./src/config/firebase-config";
import {
  LoginScreen,
  HomeScreen,
  AddProductScreen,
  ConsumeProductScreen,
  HomeManagementScreen,
  StorageScreen,
} from "./src/screens";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);

  // Adds the authStateChange listener
  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  // Modifies the initial route
  var initalRoute = "LoginScreen";
  if (auth && auth.currentUser && auth.currentUser.emailVerified) {
    initalRoute = "HomeScreen";
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initalRoute}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
        <Stack.Screen
          name="ConsumeProductScreen"
          component={ConsumeProductScreen}
        />
        <Stack.Screen
          name="HomeManagementScreen"
          component={HomeManagementScreen}
        />
        <Stack.Screen name="StorageScreen" component={StorageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
