import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { Divider } from "react-native-paper";
import { auth, firestoreDB } from "../config/firebase-config";
import { myColors } from "../constants/Colors";

export default function HomeScreen({ route, navigation }) {
  const { t } = useTranslation();

  // Sets the navigation options
  useEffect(function navigationOptions() {
    navigation.setOptions({ headerShown: false });
  }, []);

  // Sets the back options
  useEffect(function navigationOptions() {
    navigation.setOptions({ headerShown: false });
  }, []);

  // Manage logout
  const logoutAction = () => {
    const handleLogout = () => {
      auth
        .signOut()
        .then(() => {
          navigation.navigate("LoginScreen");
        })
        .catch((error) => {
          console.log(error);
        });
    };
    Alert.alert(
      t("components.home.logoutAppHeader"),
      t("components.home.logoutAppMessage"),
      [
        {
          text: t("general.cancel"),
          onPress: () => null,
          style: "cancel",
        },
        {
          text: t("general.yes"),
          onPress: () => {
            handleLogout();
          },
        },
      ]
    );
    return true;
  };

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>

      <View style={styles.header}>
        <View style={styles.headerHomeManagementContainer}>
          <TouchableOpacity>
            <Image
              source={require("../assets/homeManagement.png")}
              style={styles.headerHomeManagementButton}
            />
          </TouchableOpacity>
          <Text style={styles.headerHomeManagementText}>Home</Text>
        </View>
        <View>
          <TouchableOpacity onPress={logoutAction}>
            <Image
              source={require("../assets/logout.png")}
              style={styles.headerLogoutImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "2%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerHomeManagementContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  headerHomeManagementText: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 2,
  },
  headerHomeManagementButton: {
    width: 50,
    height: 50,
  },
  headerLogoutImage: {
    marginTop: 10,
    width: 32,
    height: 32,
  },
});
