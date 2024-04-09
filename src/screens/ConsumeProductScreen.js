import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  LogBox,
} from "react-native";
import { Button, TextInput, Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { myColors } from "../constants/Colors";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import Header from "../components/HeaderComponent";
import NumberInputModal from "../components/NumberInputModalComponent";
import { useDebounce } from "use-debounce";

import {
  consumeProduct,
  updateProductQuantity,
  getAllNotConsumed,
} from "../services/productService";

export default function ConsumeProductScreen({ route, navigation }) {
  const { t } = useTranslation();
  const defaultHome = route.params.defaultHome;

  const [allProductsNotConsumed, setAllProductsNotConsumed] = useState("");

  // Search
  const [openSearch, setOpenSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTextDebounce] = useDebounce(searchText, 300);
  const [searchedText, setSearchedText] = useState("");
  const [searchItems, setSearchItems] = useState([]);

  // ID, Name, brand, quantity, storage, date
  const [productID, setProductID] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productStorage, setProductStorage] = useState("");
  const [productExpirationDate, setProductExpirationDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const showToast = (toastType, toastHeader, toastText) => {
    Toast.show({
      type: toastType,
      text1: toastHeader,
      text2: toastText,
      position: "top",
    });
  };

  // Navigation and back options
  useEffect(function navigationOptions() {
    LogBox.ignoreAllLogs(true);
    navigation.setOptions({
      headerShown: false,
    });

    navigation.addListener("beforeRemove", (e) => {
      route.params.parentFunction(defaultHome);
    });
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Manages the confirmation of the modal
  const handleConfirm = (inputNumber) => {
    console.log(inputNumber);
    if (inputNumber >= productQuantity || inputNumber < 0) {
      closeModal();
      showToast(
        "error",
        t("general.error"),
        t("components.consumeProduct.wrongInput")
      );
      return;
    }

    closeModal();
    if (inputNumber == 0) {
      if (consumeProduct(productID)) {
        let newArray = allProductsNotConsumed.filter(function (o) {
          return o.id !== productID;
        });
        setAllProductsNotConsumed(newArray);
      }
    } else {
      if (updateProductQuantity(productID, inputNumber)) {
        let newArray = allProductsNotConsumed.map(function (o) {
          if (o.id == productID) {
            return { ...o, quantity: parseInt(inputNumber) };
          } else {
            return o;
          }
        });
        setAllProductsNotConsumed(newArray);
      }
    }

    showToast(
      "success",
      t("general.success", t("components.consumeProduct.consumed"))
    );
    setProductName("");
  };

  // Gets all the unconsumed products
  useEffect(() => {
    const getProds = async () => {
      let tempProducts = await getAllNotConsumed(defaultHome);
      setAllProductsNotConsumed(tempProducts);
    };
    getProds();
  }, []);

  // Handles searchText changes
  useEffect(
    function managerSearchText() {
      tempItems = [];
      if (searchTextDebounce != "" && searchTextDebounce.length > 1) {
        allProductsNotConsumed.forEach((product) => {
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
              product.brand = "";
            }

            labelItems = [];
            labelText = "";
            labelItems.push(
              product.name +
                " (" +
                product.quantity +
                ")" +
                " - " +
                new Date(product.expirationDate).toLocaleDateString() +
                "\n"
            );

            if (product.brand != undefined && product.brand != "")
              labelItems.push(product.brand + "\n");
            labelItems.push(product.storage);
            labelText = labelItems.join("");

            tempItems.push({
              label: labelText,
              value: product.id,
              containerStyle: {
                borderWidth: 0.3,
                height: 60,
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
    const productFound = allProductsNotConsumed.find(
      (product) => product.id === id
    );

    setProductName(productFound.name);
    setProductQuantity(productFound.quantity.toString());

    productFound.barcode == undefined
      ? setProductBarcode("")
      : setProductBarcode(productFound.barcode);

    productFound.brand == undefined
      ? setProductBrand("")
      : setProductBrand(productFound.brand);

    productFound.expirationDate == undefined
      ? setProductExpirationDate("")
      : setProductExpirationDate(productFound.expirationDate);

    productFound.storage == undefined
      ? setProductStorage("")
      : setProductStorage(productFound.storage);
  }

  function getProductByBarcode(barcode) {
    setOpenSearch(true);
    setSearchText(barcode);
  }

  handleCameraRead = (data) => {
    console.log(data);
    getProductByBarcode(data);
  };

  const handleConsumeProduct = () => {
    if (productName == "") {
      showToast(
        "error",
        t(
          "components.general.error",
          t("components.consumeProduct.missingFields")
        )
      );
      return;
    }

    openModal();
  };

  return (
    <View behavior="height" style={styles.container}>
      <Header
        callBackFunction={() => {
          navigation.goBack();
        }}
      ></Header>
      <Divider />
      <View style={styles.body}>
        <NumberInputModal
          visible={modalVisible}
          onCancel={closeModal}
          onConfirm={handleConfirm}
        />
        {
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("CameraScreen", {
                parentFunction: handleCameraRead,
              });
            }}
          >
            <Image
              source={require("../assets/barcodeCameraConsume.png")}
              style={styles.scan}
            />
          </TouchableOpacity>
        }

        {/* Search */}
        <View>
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
            placeholder={t("components.consumeProduct.searchText")}
            translation={{
              SEARCH_PLACEHOLDER: t("components.consumeProduct.search"),
              NOTHING_TO_SHOW: t("components.consumeProduct.searchNothing"),
            }}
            style={styles.dropdown}
            addCustomItem={true}
            showArrowIcon={false}
            listMode="MODAL"
            modalAnimationType="fade"
            onChangeValue={(id) => {
              if (searchedText != "") {
                setProductID(id);
                getProductById(id);
                setSearchedText("");
                setSearchItems([]);
              }
            }}
            onChangeSearchText={(text) => {
              setSearchText(text);
            }}
          />
        </View>
        {productName != "" && (
          <View style={styles.infoContainer}>
            {/* Barcode */}
            <TextInput
              style={styles.input}
              label={t("components.consumeProduct.barcode")}
              value={productBarcode}
              keyboardType="numeric"
              theme={{ colors: { primary: myColors.mainBlue } }}
              editable={false}
            />

            {/* Name */}
            <TextInput
              style={styles.input}
              label={t("components.consumeProduct.productName")}
              value={productName}
              theme={{ colors: { primary: myColors.mainBlue } }}
              editable={false}
            />

            {/* Brand */}
            <TextInput
              style={styles.input}
              label={t("components.consumeProduct.productBrand")}
              value={productBrand}
              theme={{ colors: { primary: myColors.mainBlue } }}
              editable={false}
            />

            {/* Quantity */}
            <TextInput
              style={styles.input}
              label={t("components.consumeProduct.productQuantity")}
              value={productQuantity}
              keyboardType="numeric"
              theme={{ colors: { primary: myColors.mainBlue } }}
              editable={false}
            />

            {/* Storage */}
            <TextInput
              style={styles.input}
              label={t("components.consumeProduct.storage")}
              value={productStorage}
              keyboardType="numeric"
              theme={{ colors: { primary: myColors.mainBlue } }}
              editable={false}
            />

            {/* Expiration date */}
            <TextInput
              style={styles.inputDate}
              label={t("components.consumeProduct.productExpirationDate")}
              value={new Date(productExpirationDate).toLocaleDateString()}
              keyboardType="numeric"
              theme={{ colors: { primary: myColors.mainBlue } }}
              editable={false}
            />

            {/* Consume button */}
            <Button
              mode="contained-tonal"
              onPress={handleConsumeProduct}
              style={styles.consumeProductButton}
              theme={{
                colors: {
                  secondaryContainer: myColors.mainRed,
                  onSecondaryContainer: myColors.white,
                },
              }}
            >
              {t("components.consumeProduct.consumeProductButton")}
            </Button>
          </View>
        )}
      </View>
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
    alignSelf: "stretch",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  scan: {
    height: 80,
    width: 80,
  },
  searchBar: {
    width: "100%",
    backgroundColor: "white",
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
  dropdown: {
    width: "100%",
    height: 60,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 6,
  },
  consumeProductButton: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "black",
  },
});
