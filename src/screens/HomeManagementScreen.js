import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  LogBox,
  useWindowDimensions,
} from "react-native";
import Header from "../components/HeaderComponent";

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

  // My homes
  const FirstRoute = () => {
    return <View></View>;
  };

  // Add homes
  const SecondRoute = () => {
    return <View></View>;
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
});
