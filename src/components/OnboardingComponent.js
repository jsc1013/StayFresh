import { Image, StyleSheet, View } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { useTranslation } from "react-i18next";
import { i18next } from "../services/i18next";
import { myColors } from "../constants/Colors";

const SimpleOnboarding = ({ callBackFunction }) => {
  const { t } = useTranslation();

  return (
    <Onboarding
      onDone={() => callBackFunction()}
      showSkip={false}
      nextLabel={t("components.onboarding.next")}
      pages={[
        {
          backgroundColor: myColors.mainGreen,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/logo.png")}
              />
            </View>
          ),
          title: t("components.onboarding.welcome"),
          subtitle: t("components.onboarding.page1Text"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/homeScreen.png")}
              />
            </View>
          ),
          title: t("components.onboarding.startTitle"),
          subtitle: t("components.onboarding.startText"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/createHome.jpeg")}
              />
            </View>
          ),
          title: t("components.onboarding.setupHomeTitle"),
          subtitle: t("components.onboarding.setupHomeText"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/establishDefault.jpeg")}
              />
            </View>
          ),
          title: t("components.onboarding.establishDefaultTitle"),
          subtitle: t("components.onboarding.establishDefaultText"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/homeEstablished.jpeg")}
              />
            </View>
          ),
          title: t("components.onboarding.establishedHomeTitle"),
          subtitle: t("components.onboarding.establishedHomeText"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/createStorage.png")}
              />
            </View>
          ),
          title: t("components.onboarding.createStorageTitle"),
          subtitle: t("components.onboarding.createStorageText"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/addProduct.jpeg")}
              />
            </View>
          ),
          title: t("components.onboarding.addProductTitle"),
          subtitle: t("components.onboarding.addProductText"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/homeOverview.jpeg")}
              />
            </View>
          ),
          title: t("components.onboarding.homeOverviewTitle"),
          subtitle: t("components.onboarding.homeOverviewText"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/homeEditProducts.jpeg")}
              />
            </View>
          ),
          title: t("components.onboarding.homeOverviewEditTitle"),
          subtitle: t("components.onboarding.homeOverviewEditText"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/storageOverview.jpeg")}
              />
            </View>
          ),
          title: t("components.onboarding.storageOverviewTitle"),
          subtitle: t("components.onboarding.storageOverviewText"),
        },
        {
          backgroundColor: myColors.androidDefaultWhite,
          image: (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={require("../assets/onboarding/storageEdition.png")}
              />
            </View>
          ),
          title: t("components.onboarding.storageEditionTitle"),
          subtitle: t("components.onboarding.storageEditionText"),
        },
      ]}
    />
  );
};

export default SimpleOnboarding;

const styles = StyleSheet.create({
  imageContainer: {
    width: 400,
    height: 400,
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
});
