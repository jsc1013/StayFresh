import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  LogBox,
  KeyboardAvoidingView,
} from "react-native";
import Header from "../components/HeaderComponent";
import { useTranslation } from "react-i18next";

export default function AddProductScreenScreen({ route, navigation }) {
  const { t } = useTranslation();
  const defaultHome = route.params.defaultHome;

  // Navigation and back options
  useLayoutEffect(function navigationOptions() {
    LogBox.ignoreAllLogs(true);
    navigation.setOptions({
      headerShown: false,
    });

    navigation.addListener("beforeRemove", (e) => {
      route.params.parentFunction(defaultHome);
    });
  }, []);

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <Header
        callBackFunction={() => {
          navigation.goBack();
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
