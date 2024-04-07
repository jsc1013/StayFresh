import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  LogBox,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import Header from "../components/HeaderComponent";
import { TextInput, Button } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { myColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";

export default function AddProductScreenScreen({ route, navigation }) {
  const { t } = useTranslation();
  const defaultHome = route.params.defaultHome;

  // Search
  const [openSearch, setOpenSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedText, setSearchedText] = useState("");
  const [searchItems, setSearchItems] = useState([]);

  // Name, brand, quantity
  const [productBarcode, setProductBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productQuantity, setProductQuantity] = useState("");

  // Storage
  const [openStorage, setOpenStorage] = useState(false);
  const [storageValue, setStorageValue] = useState("");
  const [storageItems, setStorageItems] = useState([]);

  // Date
  const [expirationDate, setExpirationDate] = useState(new Date());

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

      <View style={styles.body}>
        <TouchableOpacity>
          <Image
            source={require("../assets/barcodeCameraAdd.png")}
            style={styles.scanImage}
          />
        </TouchableOpacity>
        <DropDownPicker
          open={openSearch}
          value={searchedText}
          items={searchItems}
          setOpen={setOpenSearch}
          setValue={setSearchedText}
          disableLocalSearch={true}
          theme="LIGHT"
          multiple={false}
          mode="SIMPLE"
          searchable={true}
          placeholder={t("components.addProduct.searchText")}
          translation={{
            SEARCH_PLACEHOLDER: t("components.addProduct.search"),
            NOTHING_TO_SHOW: t("components.addProduct.searchNothing"),
          }}
          style={styles.dropdown}
          showArrowIcon={false}
          listMode="MODAL"
          modalAnimationType="fade"
          onChangeValue={(id) => {
            if (searchedText != "") {
              getProductById(id);
              setSearchedText("");
            }
          }}
          onChangeSearchText={(text) => {
            setSearchText(text);
          }}
        />
        <TextInput
          style={styles.input}
          label={t("components.addProduct.barcode")}
          onChangeText={(text) => {
            setProductBarcode(text);
          }}
          value={productBarcode}
          keyboardType="numeric"
          theme={{ colors: { primary: myColors.mainBlue } }}
        />
        <TextInput
          style={styles.input}
          label={t("components.addProduct.productName")}
          onChangeText={(text) => {
            setProductName(text);
          }}
          value={productName}
          theme={{ colors: { primary: myColors.mainBlue } }}
        />
        <TextInput
          style={styles.input}
          label={t("components.addProduct.productBrand")}
          onChangeText={(text) => {
            setProductBrand(text);
          }}
          value={productBrand}
          theme={{ colors: { primary: myColors.mainBlue } }}
        />
        <TextInput
          style={styles.input}
          label={t("components.addProduct.productQuantity")}
          onChangeText={(text) => {
            setProductQuantity(text);
          }}
          value={productQuantity}
          keyboardType="numeric"
          theme={{ colors: { primary: myColors.mainBlue } }}
        />

        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => showDatepicker()}
        >
          <TextInput
            style={styles.inputDate}
            label={t("components.addProduct.productExpirationDate")}
            value={expirationDate.toLocaleDateString()}
            keyboardType="numeric"
            theme={{ colors: { primary: myColors.mainBlue } }}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      <Button
        mode="contained-tonal"
        style={styles.addProductButton}
        theme={{
          colors: {
            secondaryContainer: myColors.mainGreen,
            onSecondaryContainer: myColors.white,
          },
        }}
      >
        {t("components.addProduct.addProductButton")}
      </Button>
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
  body: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  scanImage: {
    height: 80,
    width: 80,
  },
  input: {
    height: 55,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    width: "100%",
  },
  inputDate: {
    height: 55,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    width: "100%",
    borderRadius: 0,
  },
  addProductButton: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
  },
});
