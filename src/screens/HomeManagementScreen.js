import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text, Image, LogBox } from "react-native";
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

  return (
    <View style={styles.container}>
      <Header
        callBackFunction={() => {
          navigation.goBack();
        }}
      ></Header>
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
});
