import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from "react-native-paper";

export default function LoginScreen({}) {
  const navigation = useNavigation();

  useEffect(function navigationOptions() {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.image}
          resizeMode="contain"
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
});
