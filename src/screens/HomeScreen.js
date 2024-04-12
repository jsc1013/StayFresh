import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { Divider } from "react-native-paper";
import Toast from "react-native-toast-message";
import { auth } from "../config/firebase-config";
import SwipeComponent from "../components/SwipeComponent";
import DropdownInputModal from "../components/DropdownModalComponent";
import { isInt } from "../helpers/dataTypesChecks";
import {
  getUserProductsPreviewDate,
  updateProductQuantity,
  consumeProduct,
} from "../services/productService";
import {
  getUserData,
  createUserProfile,
  updateUserHomes,
} from "../services/userService";
import NumberInputModal from "../components/NumberInputModalComponent";

export default function HomeScreen({ route, navigation }) {
  const [loadingModalVisible, setLoadingModalVisible] = useState(true);

  const [userHomes, setUserHomes] = useState([]);
  const [defaultHomeID, setDefaultHomeID] = useState("");
  const [defaultHomeName, setDefaultHomeName] = useState("");
  const [defaultHomePreviewDays, setDefaultHomePreviewDays] = useState();
  const [defaultHomePreviewDate, setDefaultHomePreviewDate] = useState();

  const [products, setProducts] = useState([]);

  const [editProductModalVisible, setEditProductModalVisible] = useState(false);
  const [updateProductId, setUpdateProductId] = useState("");

  const [dropdownInputModalVisible, setDropdownInputModalVisible] =
    useState(false);

  const dropDownOptions = [3, 7, 15];

  const { t } = useTranslation();

  const milisecondsInDay = 86400000;

  // Sets the navigation options
  useLayoutEffect(function navigationOptions() {
    navigation.setOptions({ headerShown: false });
  }, []);

  // Sets the back options
  useLayoutEffect(function backOptions() {
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

  // Load user data effect
  useLayoutEffect(() => {
    loadUserData();
  }, []);

  // Shows the toast component
  function showToast(toastType, toastHeader, toastText, position = "top") {
    Toast.show({
      type: toastType,
      text1: toastHeader,
      text2: toastText,
      position: position,
    });
  }

  // Shows the loading modal
  function showLoadingModal() {
    setLoadingModalVisible(true);
  }

  // Clears the loading modal
  function closeLoadingModal() {
    setLoadingModalVisible(false);
  }

  // Retreives the user data from the service
  async function loadUserData() {
    userData = await getUserData(auth.currentUser.email);
    if (userData) {
      setUserHomes(userData.homes);
      var searchDefault = userData.homes.find((home) => home.default == true);
      if (searchDefault != undefined) {
        let previewDate = setUserInitialData(searchDefault);
        loadUserProducts(searchDefault.id, previewDate);
      } else {
        clearUserState();
      }
    } else {
      created = await createUserProfile();
    }
  }

  // Loads all products for a home
  async function loadUserProducts(
    homeId,
    previewDate = defaultHomePreviewDate
  ) {
    getUserProductsPreviewDate(homeId, previewDate).then((prod) => {
      setProducts(prod);
      closeLoadingModal();
    });
  }

  // Clears all user state variables
  function clearUserState() {
    setDefaultHomeID("");
    setDefaultHomeName("");
    setProducts([]);
  }

  // Establishes the user initial data into the state
  function setUserInitialData(defaultHome) {
    setDefaultHomeID(defaultHome.id);
    setDefaultHomeName(defaultHome.name);
    previewDate =
      defaultHome.previewDays * milisecondsInDay + new Date().getTime();
    setDefaultHomePreviewDays(defaultHome.previewDays);
    setDefaultHomePreviewDate(previewDate);
    loadUserProducts(defaultHome.id, previewDate);
    return previewDate;
  }

  // Updates the user products on screen
  function updateUserProducts() {
    showLoadingModal(true);
    loadUserProducts(defaultHomeID, defaultHomePreviewDate);
  }

  // Manage logout
  function logoutAction() {
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
  }

  // Callback function for edit button in swipe list
  function handleSwipeEditProduct(productid) {
    setUpdateProductId(productid);
    setEditProductModalVisible(true);
  }

  // Callback function for confirm button in number modal
  async function handleModalConfirmEdit(inputNumber) {
    if (!isInt(inputNumber) || inputNumber <= 0) {
      Alert.alert(t("components.home.positiveValue"));
      return;
    }
    setEditProductModalVisible(false);
    showLoadingModal();
    updateProductQuantity(updateProductId, inputNumber);
    let tempProducts = [...products];
    product = tempProducts.find((p) => p.id == updateProductId);
    product.quantity = parseInt(inputNumber);
    setProducts(tempProducts);
    closeLoadingModal();
    showToast(
      "success",
      t("general.success"),
      t("components.home.productUpdated")
    );
  }

  // Callback function for consume button in swipe list
  function handleConsumeProduct(productid) {
    Alert.alert(
      t("components.home.deleteProductHeader"),
      t("components.home.deleteProductMessage"),
      [
        {
          text: t("general.cancel"),
          onPress: () => null,
          style: "cancel",
        },
        {
          text: t("general.yes"),
          onPress: () => {
            confirmConsumeProduct(productid);
          },
        },
      ]
    );
  }

  // Calls to consume product
  async function confirmConsumeProduct(productid) {
    showLoadingModal();
    consumeProduct(productid);
    let productsTemp = [...products];
    productsTemp = productsTemp.filter((obj) => obj.id !== productid);
    setProducts(productsTemp);
    closeLoadingModal();
    showToast(
      "success",
      t("general.success"),
      t("components.home.productConsumed")
    );
  }

  // Callback function for dropdown input modal
  async function handleDropdownInputModal(value) {
    setDropdownInputModalVisible(false);
    previewDate = parseInt(value) * milisecondsInDay + new Date().getTime();
    setLoadingModalVisible(true);
    tempUserHomes = [...userHomes];
    let home = tempUserHomes.find((userHome) => userHome.id == defaultHomeID);
    home.previewDays = parseInt(value);
    let result = await updateUserHomes(auth.currentUser.email, tempUserHomes);
    if (result) {
      setUserHomes(tempUserHomes);
      setDefaultHomePreviewDays(parseInt(value));
      setDefaultHomePreviewDate(parseInt(previewDate));
      loadUserProducts(defaultHomeID, parseInt(previewDate));
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>

      {/* LOADING MODAL */}
      <Modal
        style={styles.loadingModal}
        transparent={true}
        visible={loadingModalVisible}
      >
        <BlurView
          intensity={90}
          tint="light"
          style={styles.loadingModalBackground}
        >
          <ActivityIndicator size="large"></ActivityIndicator>
        </BlurView>
      </Modal>

      {/* NUMBER INPUT MODAL */}
      <NumberInputModal
        visible={editProductModalVisible}
        onCancel={() => {
          setEditProductModalVisible(false);
        }}
        onConfirm={handleModalConfirmEdit}
      />

      {/* DROPDOWN MODAL */}
      <DropdownInputModal
        visible={dropdownInputModalVisible}
        onCancel={() => {
          setDropdownInputModalVisible(false);
        }}
        onConfirm={handleDropdownInputModal}
        placeholder={t("components.home.defaultPreviewDays")}
        receivedItems={dropDownOptions}
        sortText={false}
      ></DropdownInputModal>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerHomeManagementContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("HomeManagementScreen", {
                userHomes: userHomes,
                parentFunction: loadUserData,
              });
            }}
          >
            <Image
              source={require("../assets/homeManagement.png")}
              style={styles.headerHomeManagementButton}
            />
          </TouchableOpacity>
          <Text style={styles.headerHomeManagementText}>{defaultHomeName}</Text>
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
          <TouchableOpacity
            onPress={() => {
              if (defaultHomeID != "") {
                navigation.navigate("AddProductScreen", {
                  defaultHome: defaultHomeID,
                  parentFunction: loadUserProducts,
                });
              } else {
                showToast(
                  "error",
                  t("general.error"),
                  t("components.home.missingDefaultHome")
                );
              }
            }}
          >
            <Image
              source={require("../assets/addProduct.png")}
              style={styles.buttonImage}
            />
          </TouchableOpacity>
          <Text style={styles.buttonText}>{t("components.home.addText")}</Text>
        </View>

        {/* CONSUME PRODUCT */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ConsumeProductScreen", {
                defaultHome: defaultHomeID,
                parentFunction: loadUserProducts,
              });
            }}
          >
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
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("StorageScreen", {
                defaultHome: defaultHomeID,
                parentFunction: loadUserProducts,
              })
            }
          >
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
          <TouchableOpacity onPress={() => setDropdownInputModalVisible(true)}>
            <Text style={styles.nextToExpireText}>
              {" "}
              {t("components.home.nextExpiraciesText", {
                days: defaultHomePreviewDays,
              })}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => updateUserProducts()}>
          <Image
            source={require("../assets/update.png")}
            style={styles.nextToExpireUpdateImage}
          />
        </TouchableOpacity>
      </View>

      {/* PRODUCT SUMMARY */}
      <SwipeComponent
        products={products}
        functionEdit={handleSwipeEditProduct}
        functionDelete={handleConsumeProduct}
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
  loadingModalBackground: {
    flex: 1,
    justifyContent: "center",
  },
});
