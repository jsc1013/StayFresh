import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  LogBox,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Header from "../components/HeaderComponent";
import { TextInput, Button } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { myColors } from "../constants/Colors";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { getHomeStorages } from "../services/homeService";
import { getAllProductsPeriod, addProduct } from "../services/productService";

export default function AddProductScreenScreen({ route, navigation }) {
  const { t } = useTranslation();
  const defaultHome = route.params.defaultHome;

  const [allProductsPeriod, setAllProductsPeriod] = useState([]);

  const days = 180;
  const fetchPeriod = new Date().getTime() - 1000 * 60 * 60 * 24 * days;

  // Search
  const [openSearch, setOpenSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTextDebounce] = useDebounce(searchText, 300);
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

  const showToast = (toastType, toastHeader, toastText) => {
    Toast.show({
      type: toastType,
      text1: toastHeader,
      text2: toastText,
      position: "top",
    });
  };

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

  // fetchProducts
  useEffect(() => {
    async function fetchProducts() {
      let products = await getAllProductsPeriod(defaultHome, fetchPeriod);
      setAllProductsPeriod(products);
    }
    fetchProducts();
  }, []);

  // Gets the different storages from the defaultHome
  useEffect(() => {
    async function getStorages() {
      storagesFirebase = await getHomeStorages(defaultHome);
      tempItemsStorage = [];
      storagesFirebase.forEach((storage) => {
        tempItemsStorage.push({ label: storage, value: storage });
      });
      setStorageItems(tempItemsStorage);
    }
    getStorages();
  }, []);

  // Handles searchText changes
  useEffect(
    function manageSearchText() {
      tempItems = [];
      if (searchTextDebounce != "" && searchTextDebounce.length > 1) {
        allProductsPeriod.forEach((product) => {
          if (
            (product["barcode"] != undefined &&
              product["barcode"].includes(searchTextDebounce.toLowerCase())) ||
            product["name"]
              .toLowerCase()
              .includes(searchTextDebounce.toLowerCase()) ||
            (product["brand"] != undefined &&
              product["brand"]
                .toLowerCase()
                .includes(searchTextDebounce.toLowerCase()))
          ) {
            if (product.brand == undefined) {
              product.brand = "";
            }

            if (product.barcode == undefined) {
              product.barcode = "";
            }
            tempItems.push({
              label:
                product.name + ": " + product.barcode + "\n" + product.brand,
              value: product.id,
              containerStyle: {
                borderWidth: 0.3,
                height: 50,
              },
            });
          }
        });
        setSearchItems(tempItems);
      } else {
        setSearchItems([]);
      }
    },
    [searchTextDebounce]
  );

  function getProductById(id) {
    const productFound = allProductsPeriod.find((product) => product.id === id);
    setProductName(productFound.name);
    setProductBrand(productFound.brand);

    productFound.barcode == undefined
      ? setProductBarcode("")
      : setProductBarcode(productFound.barcode);
  }

  function resetFields() {
    setProductName("");
    setProductBrand("");
    setProductQuantity("");
    setProductBarcode("");
    setExpirationDate(new Date());
  }

  function onTimePickerChange(event, selectedDate) {
    const currentDate = selectedDate;
    setExpirationDate(currentDate);
  }

  function showMode(currentMode) {
    DateTimePickerAndroid.open({
      value: expirationDate,
      onChange: onTimePickerChange,
      mode: currentMode,
      is24Hour: true,
    });
  }

  function showDatepicker() {
    showMode("date");
  }

  async function handleAddProduct() {
    if (
      productName == "" ||
      productBrand == "" ||
      productQuantity == "" ||
      storageValue == ""
    ) {
      showToast(
        "error",
        t("components.general.error", t("components.addProduct.missingFields"))
      );
      return;
    }

    const newDoc = {
      addedDate: new Date().getTime(),
      barcode: productBarcode,
      brand: productBrand,
      consumed: false,
      expirationDate: expirationDate.getTime(),
      home: defaultHome,
      name: productName,
      quantity: parseInt(productQuantity),
      storage: storageValue,
    };

    if (await addProduct(newDoc)) {
      showToast(
        "success",
        t("components.general.success", t("components.addProduct.added"))
      );
      resetFields();
    }
  }

  return (
    <View style={styles.container}>
      <Header
        callBackFunction={() => {
          navigation.goBack();
        }}
      />
      <ScrollView contentContainerStyle={styles.body}>
        <TouchableOpacity>
          <Image
            source={require("../assets/barcodeCameraAdd.png")}
            style={styles.scanImage}
          />
        </TouchableOpacity>

        {/* SEARCH */}
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

        {/* BARCODE */}
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

        {/* NAME */}
        <TextInput
          style={styles.input}
          label={t("components.addProduct.productName")}
          onChangeText={(text) => {
            setProductName(text);
          }}
          value={productName}
          theme={{ colors: { primary: myColors.mainBlue } }}
        />

        {/* BRAND */}
        <TextInput
          style={styles.input}
          label={t("components.addProduct.productBrand")}
          onChangeText={(text) => {
            setProductBrand(text);
          }}
          value={productBrand}
          theme={{ colors: { primary: myColors.mainBlue } }}
        />

        {/* QUANTITY*/}
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

        <DropDownPicker
          open={openStorage}
          value={storageValue}
          items={storageItems}
          setOpen={setOpenStorage}
          setValue={setStorageValue}
          setItems={setStorageItems}
          theme="LIGHT"
          multiple={false}
          mode="SIMPLE"
          listMode="MODAL"
          modalAnimationType="fade"
          placeholder={t("components.addProduct.selectStorage")}
          style={styles.dropdown}
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
        <Button
          mode="contained-tonal"
          onPress={handleAddProduct}
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
      </ScrollView>
      <Toast />
    </View>
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
    justifyContent: "space-between",
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
  dropdown: {
    width: "100%",
    height: 60,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 6,
  },
});
