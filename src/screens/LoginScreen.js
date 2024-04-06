import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from "react-native-paper";
import { myColors } from "../constants/Colors";

export default function LoginScreen({}) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(function navigationOptions() {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}></View>
      <Image
        source={require("../assets/logo.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={"Email"}
          value={email}
          keyboardType="email-address"
          theme={{ colors: { primary: myColors.mainGreen } }}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={"Password"}
          value={password}
          theme={{ colors: { primary: myColors.mainGreen } }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 200,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 60,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
