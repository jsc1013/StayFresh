import React, { useEffect, useLayoutEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { auth } from "./src/config/firebase-config";
import { LoginScreen, HomeScreen } from "./src/screens";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
