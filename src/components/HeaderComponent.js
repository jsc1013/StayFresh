import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  LogBox,
} from "react-native";
import { Divider } from "react-native-paper";

const Header = ({ callBackFunction }) => {
  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={callBackFunction}>
          <Image
            source={require("../assets/back.png")}
            style={styles.backImage}
          />
        </TouchableOpacity>
      </View>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "2%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backImage: {
    marginTop: 10,
    width: 32,
    height: 32,
  },
});

export default Header;
