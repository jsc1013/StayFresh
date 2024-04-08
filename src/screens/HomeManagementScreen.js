import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  LogBox,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import Header from "../components/HeaderComponent";

import { auth } from "../config/firebase-config";
import { Button, Divider } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { myColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import DropDownPicker from "react-native-dropdown-picker";
import TextInputModal from "../components/TextInputModalComponent";

import {
  deleteHome,
  updateHomeUsers,
  getHomeData,
  checkHomeIdExists,
} from "../services/homeService";

import { updateUserHomes } from "../services/userService";

export default function HomeManagementScreen({ route, navigation }) {
  const layout = useWindowDimensions();
  const { t } = useTranslation();

  // Navigation and back options
  useLayoutEffect(function navigationOptions() {
    LogBox.ignoreAllLogs(true);
    navigation.setOptions({
      headerShown: false,
    });
    navigation.addListener("beforeRemove", (e) => {
      route.params.parentFunction();
    });
  }, []);

  const showToast = (toastType, toastHeader, toastText, position = "top") => {
    Toast.show({
      type: toastType,
      text1: toastHeader,
      text2: toastText,
      position: position,
    });
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: t("components.homeManagement.firstTabTitle") },
    { key: "second", title: t("components.homeManagement.secondTabTitle") },
  ]);
  const [userHomes, setUserHomes] = useState(route.params.userHomes);

  function checkHomeExists(homeName) {
    if (
      (searchHome = userHomes.find(
        (home) => home.name.toLowerCase() == homeName.toLowerCase()
      ))
    ) {
      showToast(
        "error",
        t("general.error"),
        t("components.homeManagement.repeatedHome")
      );
      return true;
    } else {
      return false;
    }
  }

  // My homes
  const FirstRoute = () => {
    const [openUserHomeCombo, setOpenUserHomeCombo] = useState(false);
    const [userHomeComboItems, setUserHomeComboItems] = useState([]);
    const [userHomeComboValue, setUserHomeComboValue] = useState("");
    const [showOptions, setShopOptions] = useState(false);
    const [qrCodeValue, setQRCodeValue] = useState("Initial");
    const [refreshCombo, setRefreshCombo] = useState(true);

    const [modalFirstRouteVisible, setModalFirstRouteVisible] = useState(false);

    // updateUserHomesCombo
    useEffect(
      function updateUserHomesCombo() {
        if (refreshCombo) {
          tempHomes = [];
          userHomes.forEach((home) => {
            if (home.default) {
              tempHomes.push({
                label: home.name,
                value: home.id,
                icon: () => (
                  <Icon name="home" size={18} color={myColors.mainGreen} />
                ),
              });
            } else {
              tempHomes.push({
                label: home.name,
                value: home.id,
              });
            }
          });
          setUserHomeComboItems(tempHomes);
          setRefreshCombo(false);
        }
      },
      [refreshCombo]
    );

    // updateShowOptions
    useEffect(
      function updateShowOptions() {
        if (userHomeComboValue != "") {
          setShopOptions(true);
          setQRCodeValue(userHomeComboValue);
        } else {
          setShopOptions(false);
          setQRCodeValue("Invalid");
        }
      },
      [userHomeComboValue]
    );

    function closeModalFirstRoute() {
      setModalFirstRouteVisible(false);
    }

    // Manages the confirmation of the modal
    function handleConfirmFirstRoute(inputText) {
      if (checkHomeExists(inputText)) {
        setModalFirstRouteVisible(false);
        return;
      }
      var tempUserHomes = userHomes;
      tempUserHomes.forEach((home) => {
        if (home.id == userHomeComboValue) {
          home.name = inputText;
        }
      });

      if (updateHomes(auth.currentUser.email, tempUserHomes)) {
        setUserHomes(tempUserHomes);
        setRefreshCombo(true);
        showToast(
          "success",
          t("general.success"),
          t("components.homeManagement.homeNameUpdated")
        );
        setModalFirstRouteVisible(false);
      }
    }

    async function establishDefault() {
      tempHomes = userHomes;
      tempHomes.forEach((home) => {
        home.id == userHomeComboValue
          ? (home.default = true)
          : (home.default = false);
      });

      if (updateUserHomes(auth.currentUser.email, tempHomes)) {
        setUserHomes(tempHomes);
        setRefreshCombo(true);
        showToast(
          "success",
          t("general.success"),
          t("components.homeManagement.defaultSet")
        );
      }
    }

    function editHomeName() {
      setModalFirstRouteVisible(true);
    }

    async function manageLeaveHome() {
      homeData = await getHomeData(userHomeComboValue);
      if (homeData) {
        if (
          homeData.users.length == 0 ||
          (homeData.users.length == 1 &&
            homeData.users[0] == auth.currentUser.email)
        ) {
          leaveHomeAndDeleteRequest();
        } else {
          leaveHomeRequest(homeData.users);
        }
      } else {
        showToast(
          "error",
          t("general.error"),
          t("components.homeManagement.errorLeavingHome")
        );
      }
    }

    function leaveHomeAndDeleteRequest() {
      Alert.alert(
        t("components.homeManagement.deleteHomeTitle"),
        t("components.homeManagement.deleteHomeText"),
        [
          {
            text: t("general.cancel"),
            onPress: () => null,
            style: "cancel",
          },
          {
            text: t("general.yes"),
            onPress: () => {
              leaveHomeAndDelete();
            },
          },
        ]
      );
    }

    async function leaveHomeAndDelete() {
      await deleteHome(userHomeComboValue);
      userHomesFiltered = userHomes.filter(function (obj) {
        return obj.id !== userHomeComboValue;
      });
      await updateHomes(auth.currentUser.email, userHomesFiltered);
      setUserHomes(userHomesFiltered);
      showToast(
        "success",
        t("general.success"),
        t("components.homeManagement.leftHome")
      );
    }

    function leaveHomeRequest(usersArray) {
      Alert.alert(
        t("components.homeManagement.leaveHomeTitle"),
        t("components.homeManagement.leaveHomeText"),
        [
          {
            text: t("general.cancel"),
            onPress: () => null,
            style: "cancel",
          },
          {
            text: t("general.yes"),
            onPress: () => {
              leaveHome(usersArray);
            },
          },
        ]
      );
    }

    async function leaveHome(usersArray) {
      var index = usersArray.indexOf(auth.currentUser.email);
      if (index !== -1) usersArray.splice(index, 1);

      if (!updateHomeUsers(userHomeComboValue, usersArray)) {
        return;
      }

      userHomesFiltered = userHomes.filter(function (obj) {
        return obj.id !== userHomeComboValue;
      });

      if (!updateUserHomes(auth.currentUser.email, userHomesFiltered)) {
        return;
      }

      setUserHomes(userHomesFiltered);
      showToast(
        "success",
        t("general.success"),
        t("components.homeManagement.leftHome")
      );
    }

    return (
      <View style={styles.firstRouteContainer}>
        {/* MODAL CAMBIO DE NOMBRE */}
        <TextInputModal
          visible={modalFirstRouteVisible}
          onCancel={closeModalFirstRoute}
          onConfirm={handleConfirmFirstRoute}
          placeholder={t("components.homeManagement.newHomeName")}
        />
        {/* SELECCION HOGAR */}
        <DropDownPicker
          open={openUserHomeCombo}
          value={userHomeComboValue}
          items={userHomeComboItems}
          setOpen={setOpenUserHomeCombo}
          setValue={setUserHomeComboValue}
          setItems={setUserHomeComboItems}
          theme="LIGHT"
          multiple={false}
          modalAnimationType="fade"
          placeholder={t("components.homeManagement.selectHome")}
          style={styles.dropdown}
        />
        {showOptions && (
          <View style={styles.optionsContainer}>
            {/* ESTABLECER POR DEFECTO */}
            <Button
              mode="contained-tonal"
              onPress={() => {
                establishDefault();
              }}
              style={styles.establishDefault}
              theme={{
                colors: {
                  secondaryContainer: myColors.mainGreen,
                  onSecondaryContainer: myColors.white,
                },
              }}
            >
              {t("components.homeManagement.establishDefault")}
            </Button>

            {/* EDITAR NOMBRE */}
            <Button
              mode="contained-tonal"
              onPress={() => {
                editHomeName();
              }}
              style={styles.editHomeName}
              theme={{
                colors: {
                  secondaryContainer: myColors.mainGreen,
                  onSecondaryContainer: myColors.white,
                },
              }}
            >
              {t("components.homeManagement.editHomeName")}
            </Button>

            {/* QR */}
            <TouchableOpacity
              style={styles.qrCodeContainer}
              onPress={() => {
                Clipboard.setStringAsync(qrCodeValue);
                showToast(
                  "success",
                  t("general.success"),
                  t("components.homeManagement.copiedClipboard")
                );
              }}
            >
              <QRCode size={150} value={qrCodeValue} />
              <Text style={styles.qrCodeID}>{qrCodeValue}</Text>
            </TouchableOpacity>
            <Button
              mode="contained-tonal"
              onPress={manageLeaveHome}
              style={styles.leaveHome}
              theme={{
                colors: {
                  secondaryContainer: myColors.mainRed,
                  onSecondaryContainer: myColors.white,
                },
              }}
            >
              {t("components.homeManagement.leaveHome")}
            </Button>
          </View>
        )}
      </View>
    );
  };

  // Add homes
  const SecondRoute = () => {
    const [newHomeID, setNewHomeID] = useState("");
    const [newHomeName, setNewHomeName] = useState("");
    const [modalSecondRouteVisible, setModalSecondRouteVisible] =
      useState(false);

    // Camera
    handleCameraRead = (data) => {
      setNewHomeID(data);
    };

    const closeModalSecondRoute = () => {
      setModalSecondRouteVisible(false);
    };

    const addExistingHome = (newHomeID) => {
      if (newHomeID == "") {
        showToast(
          "error",
          t("general.error"),
          t("components.homeManagement.introduceHomeID")
        );
        return;
      }
      // Check if home has already been added
      searchHome = userHomes.find(
        (home) => home.id.toLowerCase() == newHomeID.toLowerCase()
      );
      if (searchHome != undefined) {
        showToast(
          "error",
          t("general.error"),
          t("components.homeManagement.homeAlreadyAdded")
        );
        return;
      }
      if (checkHomeIdExists(newHomeID)) {
        setModalSecondRouteVisible(true);
      } else {
        showToast(
          "error",
          t("general.error"),
          t("components.homeManagement.homeNotExist")
        );
        return;
      }
    };

    // Manages the confirmation of the modal
    const handleConfirmSecondRoute = async (inputText) => {
      if (checkHomeExists(inputText)) {
        setModalSecondRouteVisible(false);
        return;
      }
      var newUserHomes = userHomes;
      newUserHomes.push({
        default: false,
        id: newHomeID,
        name: inputText,
        previewDays: 7,
      });

      let homeData = await getHomeData(newHomeID);
      if (homeData != undefined) {
        newUsers = homeData.users;
        newUsers.push(auth.currentUser.email);
        if (updateHomeUsers(newHomeID, newUsers)) {
          if (updateUserHomes(auth.currentUser.email, newUserHomes)) {
            showToast(
              "success",
              t("general.success"),
              t("components.homeManagement.newHomeAdded")
            );
            setUserHomes(newUserHomes);
            setNewHomeID("");
          }
        }
      }
      setModalSecondRouteVisible(false);
    };

    return (
      <View style={styles.secondRouteContainer}>
        <TextInputModal
          visible={modalSecondRouteVisible}
          onConfirm={handleConfirmSecondRoute}
          onCancel={closeModalSecondRoute}
          placeholder={t("components.homeManagement.newHomeName")}
        />
        <Text style={styles.existingHomeText}>
          {t("components.homeManagement.existingHome")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CameraScreen", {
              parentFunction: handleCameraRead,
            });
          }}
        >
          <Image
            source={require("../assets/qrCamera.png")}
            style={styles.scanQR}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.inputID}
          label={t("components.homeManagement.newHomeID")}
          onChangeText={(text) => {
            setNewHomeID(text);
          }}
          value={newHomeID}
          theme={{ colors: { primary: myColors.mainBlue } }}
        />
        <Button
          mode="contained-tonal"
          onPress={() => {
            addExistingHome(newHomeID);
          }}
          style={styles.addExistingHomeButton}
          theme={{
            colors: {
              secondaryContainer: myColors.mainGreen,
              onSecondaryContainer: myColors.white,
            },
          }}
        >
          {t("components.homeManagement.addExistingHome")}
        </Button>
        <Divider style={styles.divider} />
        <Text style={styles.newHomeText}>
          {t("components.homeManagement.newHome")}
        </Text>
        <TextInput
          style={styles.inputName}
          label={t("components.homeManagement.newHomeName")}
          value={newHomeName}
          onChangeText={(text) => {}}
          theme={{ colors: { primary: myColors.mainBlue } }}
        />
        <Button
          mode="contained-tonal"
          onPress={() => {}}
          style={styles.addNewHomeButton}
          theme={{
            colors: {
              secondaryContainer: myColors.mainGreen,
              onSecondaryContainer: myColors.white,
            },
          }}
        >
          {t("components.homeManagement.addNewHome")}
        </Button>
      </View>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <View style={styles.container}>
      <Header
        callBackFunction={() => {
          navigation.goBack();
        }}
      ></Header>
      <Divider />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.tabBarIndicator}
          />
        )}
      />
      <Toast />
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
  tabBar: {
    backgroundColor: "#BDBDBD",
    borderRadius: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  tabBarIndicator: {
    backgroundColor: myColors.mainGreen,
  },
  firstRouteContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    width: "100%",
  },
  dropdown: {
    width: "100%",
    height: 60,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 6,
  },
  establishDefault: {
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
  },
  editHomeName: {
    width: "100%",
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
  },
  optionsContainer: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
  },
  qrCodeContainer: { marginTop: "10%", alignItems: "center" },
  qrCodeID: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },
  leaveHome: {
    width: "50%",
    borderWidth: 1,
    borderColor: "black",
    marginTop: 30,
    position: "absolute",
    bottom: 20,
  },
  secondRouteContainer: {
    flex: 1,
    marginTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
  },
  existingHomeText: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  scanQR: {
    height: 80,
    width: 80,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  inputID: {
    height: 55,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    width: "100%",
  },
  divider: {
    width: "100%",
    marginTop: 40,
    borderWidth: 0.5,
  },
  newHomeText: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  addExistingHomeButton: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 30,
  },
  addNewHomeButton: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 30,
  },
  inputName: {
    height: 55,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    width: "100%",
    marginTop: 20,
  },
});
