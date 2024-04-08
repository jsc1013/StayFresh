import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  LogBox,
  TouchableOpacity,
  Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import Header from "../components/HeaderComponent";

export default function CameraScreen({ route, navigation }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  parentData = route.params;

  const handleBarCodeScanned = (scanningResult) => {
    parentData.parentFunction(scanningResult.data);
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    navigation.addListener("beforeRemove", (e) => {});
  }, []);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    requestPermission();
  }, []);

  return (
    <View style={styles.cameraContainer}>
      <Header
        callBackFunction={() => {
          navigation.goBack();
        }}
      />
      <Camera
        style={styles.camera}
        type={CameraType.back}
        onBarCodeScanned={(scanningResult) => {
          handleBarCodeScanned(scanningResult);
        }}
      ></Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "2%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backImage: {
    marginTop: 10,
    marginLeft: 10,
    width: 32,
    height: 32,
  },
  camera: {
    flex: 1,
  },
});
