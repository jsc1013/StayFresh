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
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={callBackFunction}
        >
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
    justifyContent: "flex-start",
    marginLeft: "4%",
    marginBottom: 10,
  },
  imageContainer: {
    width: 32,
    height: 32,
  },
  backImage: {
    width: 32,
    height: 32,
  },
});

export default Header;
