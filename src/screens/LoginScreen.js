import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../config/firebase-config";
import { i18next } from "../services/i18next";
import { useTranslation } from "react-i18next";
import { myColors } from "../constants/Colors";

export default function LoginScreen({}) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Sets the navigation options
  useEffect(function navigationOptions() {
    navigation.setOptions({ headerShown: false });
  }, []);

  // Handles the create account logic
  function handleCreateAccount() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser).then(() => {
          showToast(
            "success",
            t("general.success"),
            t("components.login.emailSent")
          );
        });
      })
      .catch((error) => {
        showErrorCode(error.code);
      });
  }

  // Handles the sign in logic
  function handleSignIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          navigation.navigate("HomeScreen");
        } else {
          showToast(
            "error",
            t("general.error"),
            t("components.login.emailSent")
          );
        }
      })
      .catch((error) => {
        showErrorCode(error.code);
      });
  }

  // Shows the toast component
  function showToast(toastType, toastHeader, toastText, position = "top") {
    Toast.show({
      type: toastType,
      text1: toastHeader,
      text2: toastText,
      position: position,
    });
  }

  // Shows the firebase message error
  function showErrorCode(code) {
    showToast("error", t("general.error"), t(`components.login.${code}`));
  }

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
          placeholder={t("components.login.requestEmail")}
          onChangeText={(text) => {
            setemail(text);
          }}
          value={email}
          keyboardType="email-address"
          theme={{ colors: { primary: myColors.mainGreen } }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("components.login.requestPassword")}
          onChangeText={(text) => {
            setPassword(text);
          }}
          value={password}
          secureTextEntry={!showPassword}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-outline" : "eye-off"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          theme={{ colors: { primary: myColors.mainGreen } }}
        />
      </View>

      <Button
        mode="contained-tonal"
        onPress={handleSignIn}
        style={styles.button}
        theme={{
          colors: {
            secondaryContainer: myColors.mainGreen,
            onSecondaryContainer: myColors.white,
          },
        }}
      >
        {t("components.login.login")}
      </Button>
      <View style={styles.signupContainer}>
        <Text style={styles.signupTextLeft}>
          {t("components.login.noAccount")}
        </Text>
      </View>

      <Button
        mode="contained-tonal"
        onPress={handleCreateAccount}
        style={styles.button}
        theme={{
          colors: {
            secondaryContainer: myColors.mainBlue,
            onSecondaryContainer: myColors.white,
          },
        }}
      >
        {t("components.login.signUp")}
      </Button>
      <Toast />
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
  button: {
    marginTop: 20,
    width: "100%",
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  signupTextLeft: {
    marginRight: 5,
  },
});
