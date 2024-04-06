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
import Toast from "react-native-toast-message";
import { auth, firestoreDB } from "../config/firebase-config";
import { myColors } from "../constants/Colors";
import SwipeComponent from "../components/SwipeComponent";
import mockupProducts from "../mockup/products.json";
import { getUserProductsPreviewDate } from "../services/productService";

export default function HomeScreen({ route, navigation }) {
  const [products, setProducts] = useState([]);

  const { t } = useTranslation();

  // Sets the navigation options
  useEffect(function navigationOptions() {
    navigation.setOptions({ headerShown: false });
  }, []);

  // Sets the back options
  useEffect(function backOptions() {
    const backAction = () => {
      Alert.alert(
        t("components.home.exitAppHeader"),
        t("components.home.exitAppMessage"),
        [
          {
            text: t("general.cancel"),
            onPress: () => null,
            style: "cancel",
          },
          {
            text: t("general.yes"),
            onPress: () => BackHandler.exitApp(),
          },
        ]
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  // getProducts effect
  useEffect(() => {
    const getProducts = () => {
      getUserProductsPreviewDate("KUE7By6t8KnByqScIkYY").then((prod) => {
        setProducts(prod);
      });
    };
    getProducts();
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

  function handleEditProduct() {}

  function handleDeleteProduct() {}

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>

      {/* HEADER */}
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

      {/* BUTTONS */}
      <View style={styles.buttonsContainer}>
        {/* ADD PRODUCT */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            <Image
              source={require("../assets/addProduct.png")}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>{t("components.home.addText")}</Text>
        </View>
        {/* CONSUME PRODUCT */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            <Image
              source={require("../assets/removeProduct.png")}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>
            {t("components.home.consumeText")}
          </Text>
        </View>
        {/* STORAGE */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            <Image
              source={require("../assets/storage.png")}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>
            {t("components.home.storageText")}
          </Text>
        </View>
      </View>

      {/* NEXT TO EXPIRE */}
      <View style={styles.nextToExpireContainer}>
        <View style={styles.nextToExpireTextContainer}>
          <TouchableOpacity>
            <Text style={styles.nextToExpireText}>Proximos 15 días</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Image
            source={require("../assets/update.png")}
            style={styles.nextToExpireUpdateImage}
          />
        </TouchableOpacity>
      </View>

      {/* PRODUCT SUMMARY */}
      <SwipeComponent
        products={products}
        functionEdit={handleEditProduct}
        functionDelete={handleDeleteProduct}
      ></SwipeComponent>
      <Toast></Toast>
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: "5%",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
  buttonImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: "bold",
  },
  nextToExpireContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "2%",
    marginLeft: "4%",
  },
  nextToExpireText: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: "4%",
    marginTop: "10%",
  },
  nextToExpireUpdateImage: {
    width: 50,
    height: 50,
    marginTop: 15,
    marginRight: 25,
  },
});
