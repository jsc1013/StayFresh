import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  LogBox,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Checkbox, Searchbar } from "react-native-paper";
import Toast from "react-native-toast-message";
import NestedListView from "react-native-nested-listview";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Toggle from "react-native-toggle-element";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Header from "../components/HeaderComponent";
import TextInputModal from "../components/TextInputModalComponent";
import NumberInputModal from "../components/NumberInputModalComponent";
import DropdownInputModal from "../components/DropdownModalComponent";
import { myColors } from "../constants/Colors";

import uuid from "react-native-uuid";
import { useTranslation } from "react-i18next";

import { updateStorages, getStorages } from "../services/storageService";
import {
  getAllNotConsumed,
  moveProducts,
  updateProductQuantity,
  updatProductDate,
  consumeProducts,
} from "../services/productService";

export default function StorageScreen({ route, navigation }) {
  const { t } = useTranslation();
  const defaultHome = route.params.defaultHome;

  const [searchText, setSearchText] = useState("");
  const [toggleValue, setToggleValue] = useState(false);
  const [allProductsNotConsumed, setAllProductsNotConsumed] = useState("");
  const [storages, setStorages] = useState([]);
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);

  const [checkedDic, setCheckedDic] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  const [itemsSelected, setItemsSelected] = useState(false);
  const [storagesSelected, setStoragesSelected] = useState(false);

  const [modalInputStorageVisible, setModalInputStorageVisible] =
    useState(false);

  const [loadingModalVisible, setLoadingModalVisible] = useState(true);

  const [numberInputModalVisible, setNumberInputModalVisible] = useState(false);

  const [dropdownInputModalVisible, setDropdownInputModalVisible] =
    useState(false);

  const {
    calculateProduct: calculateProduct,
  } = require("../helpers/productHelper");

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

  const showToast = (toastType, toastHeader, toastText) => {
    Toast.show({
      type: toastType,
      text1: toastHeader,
      text2: toastText,
      position: "top",
    });
  };

  async function closeModalInputStorage() {
    setModalInputStorageVisible(false);
  }

  // Manages the confirmation of the modal
  async function handleConfirmStorage(inputText) {
    if (
      storages.find((item) => item.toLowerCase() == inputText.toLowerCase()) !=
      undefined
    ) {
      showToast(
        "error",
        t("general.error"),
        t("components.storage.storageExists")
      );
      setModalInputStorageVisible(false);
      return;
    }
    tempStorages = storages;
    tempStorages.push(inputText);
    updateStorages(defaultHome, tempStorages);
    setStorages(tempStorages);
    setModalInputStorageVisible(false);
    arrangeDataTree(storages, allProductsNotConsumed, toggleValue);
    showToast(
      "success",
      t("general.success"),
      t("components.storage.addedStorage")
    );
  }

  // Gets all the unconsumed products
  async function getAllNotConsumedAndStorages() {
    changeButtonsStates(false, false, false, false);
    setAllProductsNotConsumed([]);
    setSelectedItems([]);
    setCheckedDic({});
    setItemsSelected(false);
    setStoragesSelected(false);

    Promise.all([
      getAllNotConsumed(defaultHome),
      getStorages(defaultHome),
    ]).then(([tempProductsArray, tempStorages]) => {
      setAllProductsNotConsumed(tempProductsArray);
      setStorages(tempStorages);
      arrangeDataTree(tempStorages, tempProductsArray, toggleValue);
      setLoadingModalVisible(false);
    });
  }

  // getAllNotConsumedAndStorages
  useLayoutEffect(() => {
    const fetch = async () => {
      await getAllNotConsumedAndStorages();
    };
    fetch();
  }, []);

  function arrangeDataTree(tempStorages, tempProductsArray, sortType) {
    setSelectedItems([]);
    setCheckedDic({});
    tempArrangedArray = [];
    tempCheckedDic = {};

    tempStorages.forEach((storage) => {
      level1 = { name: storage, key: storage, checked: false };
      level2Items = tempProductsArray.filter(
        (product) => product.storage == storage
      );

      if (level2Items.length > 0) {
        level1DescendantData = generateLevel2Descendants(
          level2Items,
          sortType,
          level1.key
        );
        level1.descendants = level1DescendantData.level2Return;
        level1.orderField = level1.descendants[0].descendants[0].orderField;
        level1.style = level1DescendantData.higherRangeStyle;
      } else {
        level1.descendants = [];
        level1.orderField = Number.MAX_SAFE_INTEGER;
      }
      level1.level = 1;
      tempCheckedDic[level1.key] = level1;
      tempArrangedArray.push(level1);
    });

    if (sortType) {
      tempArrangedArray.sort((a, b) => a.orderField - b.orderField);
    } else {
      tempArrangedArray.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
    setData(tempArrangedArray);
    setCheckedDic(tempCheckedDic);
  }

  function generateLevel2Descendants(level2Items, sortType, parent) {
    const distinctProducts = new Set();
    level2Return = [];
    var higherRangeStyle = { range: 0 };

    level2Items.forEach((product) => {
      distinctProducts.add(product.name);
    });

    distinctProducts.forEach((distinctProduct) => {
      level3Items = level2Items.filter(
        (level2Item) => level2Item.name == distinctProduct
      );
      let quantity = level3Items.reduce((acum, obj) => acum + obj.quantity, 0);
      level2 = {
        key: uuid.v4(),
        parent: parent,
        checked: false,
        level: 2,
        name: distinctProduct + " (" + quantity + ")",
      };

      descendantsData = generateLevel3Descendants(level3Items, level2.key);
      level2.descendants = descendantsData.level3Return;
      level2.style = descendantsData.higherRangeStyle;
      if (level2.style.range > higherRangeStyle.range) {
        higherRangeStyle = level2.style;
      }
      tempCheckedDic[level2.key] = level2;
      level2Return.push(level2);
    });

    if (sortType) {
      level2Return.sort(
        (a, b) => a.descendants[0].orderField - b.descendants[0].orderField
      );
    } else {
      level2Return.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    }
    return { level2Return: level2Return, higherRangeStyle: higherRangeStyle };
  }

  function generateLevel3Descendants(level3Items, parent) {
    level3Return = [];
    var higherRangeStyle = { range: 0 };
    level3Items.forEach((level3Item) => {
      level3 = {
        key: level3Item.id,
        parent: parent,
        checked: false,
        level: 3,
        orderField: level3Item.expirationDate,
        style: calculateProduct(level3Item.expirationDate),
        name:
          new Date(level3Item.expirationDate).toLocaleDateString() +
          " (" +
          level3Item.quantity +
          ")",
      };

      if (level3.style.range > higherRangeStyle.range) {
        higherRangeStyle = level3.style;
      }
      level3Return.push(level3);
      tempCheckedDic[level3.key] = level3;
    });
    level3Return.sort((a, b) => a.orderField - b.orderField);
    return { level3Return: level3Return, higherRangeStyle: higherRangeStyle };
  }

  async function updateChecked(node) {
    let checkedDicTemp = JSON.parse(JSON.stringify(checkedDic));
    let checkedSelectedItemsTemp = [...selectedItems];

    // If checked
    if (!checkedDicTemp[node.key].checked) {
      // Check current node
      checkedDicTemp[node.key].checked = true;

      if (node.level == 1) {
        checkedSelectedItemsTemp.push(node);
      }

      if (node.level == 2) {
        checkedDicTemp[node.key].descendants.forEach((descendant) => {
          descendant.checked = true;
          checkedSelectedItemsTemp.push(descendant);
          checkedDicTemp[descendant.key].checked = true;
        });
      }

      if (node.level == 3) {
        checkedSelectedItemsTemp.push(node);
        // Update the parent
        checkedDicTemp[checkedDicTemp[node.key].parent].descendants.forEach(
          (descendant) => {
            if (descendant.key == node.key) {
              descendant.checked = true;
            }
          }
        );

        // Check if parent should be checked
        allDescendantsChecked = true;
        checkedDicTemp[checkedDicTemp[node.key].parent].descendants.forEach(
          (descendant) => {
            if (!descendant.checked) {
              allDescendantsChecked = false;
            }
          }
        );

        if (allDescendantsChecked) {
          checkedDicTemp[checkedDicTemp[node.key].parent].checked = true;
        }
      }
    } else {
      checkedDicTemp[node.key].checked = false;

      if (node.level == 1) {
        checkedSelectedItemsTemp = checkedSelectedItemsTemp.filter(
          (obj) => obj.key !== node.key
        );
      }

      if (node.level == 2) {
        checkedDicTemp[node.key].descendants.forEach((descendant) => {
          descendant.checked = false;
          checkedSelectedItemsTemp = checkedSelectedItemsTemp.filter(
            (obj) => obj.key !== descendant.key
          );
          checkedDicTemp[descendant.key].checked = false;
        });
      }

      if (node.level == 3) {
        checkedSelectedItemsTemp = checkedSelectedItemsTemp.filter(
          (obj) => obj.key !== node.key
        );
        // Update the parent
        checkedDicTemp[checkedDicTemp[node.key].parent].descendants.forEach(
          (descendant) => {
            if (descendant.key == node.key) {
              descendant.checked = false;
            }
          }
        );

        // Check if parent should be unchecked
        allDescendantsUnchecked = true;
        checkedDicTemp[checkedDicTemp[node.key].parent].descendants.forEach(
          (descendant) => {
            if (descendant.checked) {
              allDescendantsChecked = false;
            }
          }
        );

        if (allDescendantsUnchecked) {
          checkedDicTemp[checkedDicTemp[node.key].parent].checked = false;
        }
      }
    }

    // Check types
    if (checkedSelectedItemsTemp.length > 0) {
      if (checkedSelectedItemsTemp[0].level == 1) {
        setStoragesSelected(true);
        changeButtonsStates(true, false, false, false);
      } else {
        setItemsSelected(true);
        if (checkedSelectedItemsTemp.length == 1) {
          changeButtonsStates(true, true, true, true);
        } else {
          changeButtonsStates(true, false, true, false);
        }
      }
    } else {
      setItemsSelected(false);
      setStoragesSelected(false);
      changeButtonsStates(false, false, false, false);
    }

    setCheckedDic(checkedDicTemp);
    setSelectedItems(checkedSelectedItemsTemp);
  }

  async function changeButtonsStates(deleteBool, date, move, quantity) {
    setShowDelete(deleteBool);
    setShowDate(date);
    setShowMove(move);
    setShowQuantity(quantity);
  }

  async function askDeleteSelectedElements() {
    Alert.alert(
      t("components.storage.askDeleteHeader"),
      t("components.storage.askDeleteMessage"),
      [
        {
          text: t("general.cancel"),
          onPress: () => null,
          style: "cancel",
        },
        {
          text: t("general.yes"),
          onPress: () => deleteSelectedElements(),
        },
      ]
    );
  }

  const deleteSelectedElements = async () => {
    if (storagesSelected) {
      storagesTemp = [...storages];
      tempProducts = [...allProductsNotConsumed];
      selectedItems.forEach((element) => {
        storagesTemp = storagesTemp.filter(function (storage) {
          return storage !== element.name;
        });

        var productsToUpdate = allProductsNotConsumed.filter(function (
          product
        ) {
          return product.storage == element.name;
        });

        tempProducts = tempProducts.filter(
          (prod) => !productsToUpdate.some((del) => del.id == prod.id)
        );
        consumeProducts(productsToUpdate);
      });
      updateStorages(defaultHome, storagesTemp);

      setStorages(storagesTemp);
      setAllProductsNotConsumed(tempProducts);
      arrangeDataTree(storagesTemp, tempProducts, toggleValue);
      showToast(
        "success",
        t("general.success"),
        t("components.storage.deleted")
      );
    } else {
      selectedItems.forEach((prod) => {
        prod.id = prod.key;
      });
      console.log(selectedItems);
      consumeProducts(selectedItems);
      let tempProducts = [...allProductsNotConsumed];
      tempProducts = tempProducts.filter(
        (prod) => !selectedItems.some((del) => del.id == prod.id)
      );
      setAllProductsNotConsumed(tempProducts);
      showToast(
        "success",
        t("general.success"),
        t("components.storage.deleted")
      );
      await arrangeDataTree(storages, tempProducts, toggleValue);
    }
  };

  async function handleCancelDropdownInputModal() {
    setDropdownInputModalVisible(false);
  }

  async function handleDropdownInputModal(value) {
    setDropdownInputModalVisible(false);
    moveSelectedElements(value);
  }

  async function moveSelectedElements(value) {
    setLoadingModalVisible(true);
    moveProducts(selectedItems, value);
    let tempProducts = [...allProductsNotConsumed];
    selectedItems.forEach((item) => {
      let product = tempProducts.find((s) => s.id == item.key);
      product.storage = value;
    });
    await arrangeDataTree(storages, tempProducts, toggleValue);
    setLoadingModalVisible(false);
    showToast("success", t("general.success"), t("components.storage.moved"));
  }

  async function handleCancelNumberInputModal() {
    setNumberInputModalVisible(false);
  }

  async function handleNumberInputModal(inputNumber) {
    updateProductQty(inputNumber);
  }

  async function updateProductQty(inputNumber) {
    setNumberInputModalVisible(false);
    updateProductQuantity(selectedItems[0].key, parseInt(inputNumber));
    let productKey = checkedDic[selectedItems[0].key].key;
    setLoadingModalVisible(true);
    tempProducts = [...allProductsNotConsumed];
    var product = tempProducts.find((s) => s.id == productKey);
    product.quantity = parseInt(inputNumber);
    showToast("success", t("general.success"), t("components.storage.updated"));
    await arrangeDataTree(storages, tempProducts, toggleValue);
    setLoadingModalVisible(false);
  }

  function showMode(currentMode) {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: onTimePickerChange,
      mode: currentMode,
      is24Hour: true,
    });
  }

  function showDatepicker() {
    showMode("date");
  }

  function onTimePickerChange(event, selectedDate) {
    if (event.type == "set") {
      callUpdateProductDate(selectedDate.getTime());
    }
  }

  async function callUpdateProductDate(date) {
    setLoadingModalVisible(true);
    await updatProductDate(selectedItems[0].key, date);
    await getAllNotConsumedAndStorages();
    showToast("success", t("general.success"), t("components.storage.updated"));
  }

  const thumbStyle = () => {
    if (toggleValue) {
      return styles.thumbButtonDate;
    } else {
      return styles.thumbButtonAlphabetic;
    }
  };

  const renderNode = (node, level) => {
    var paddingLeft = (level ?? 0 + 1) * 15;
    var style;

    if (level == 1) {
      style = styles.level1;
      paddingLeft = 10;
    }
    if (level == 2) {
      style = styles.level2;
      paddingLeft = 15;
    }
    if (level == 3) {
      if (node.style.range == 4) {
        style = {
          color: node.style.color,
          textDecorationLine: "line-through",
          textDecorationStyle: "solid",
        };
      } else {
        style = { color: node.style.color };
      }

      paddingLeft = 60;
    }

    var hasDescendants = false;

    if (node.descendants != undefined && node.descendants.length > 0) {
      hasDescendants = true;
    }

    var shouldShow = false;
    if (searchText.length > 1) {
      if (node.name.toLowerCase().includes(searchText.toLowerCase())) {
        shouldShow = true;
      }

      if (!shouldShow) {
        if (node.level == 1) {
          node.descendants.forEach((level2) => {
            if (level2.name.toLowerCase().includes(searchText.toLowerCase())) {
              shouldShow = true;
            }
          });
        }

        if (node.level == 2) {
          if (
            checkedDic[checkedDic[node.key].parent].name
              .toLowerCase()
              .includes(searchText.toLowerCase())
          ) {
            shouldShow = true;
          }
        }

        if (node.level == 3) {
          if (
            checkedDic[checkedDic[node.key].parent].name
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            checkedDic[checkedDic[checkedDic[node.key].parent].parent].name
              .toLowerCase()
              .includes(searchText.toLowerCase())
          ) {
            shouldShow = true;
          }
        }
      }
    } else {
      shouldShow = true;
    }

    if (!shouldShow) {
      return;
    }

    return (
      <View
        style={[
          styles.node,
          {
            paddingLeft,
            borderWidth: 0.2,
            marginTop: 2,
          },
        ]}
      >
        <Text style={style}>{node.name}</Text>

        {node.style != undefined && node.style.icon != undefined && (
          <Icon
            style={styles.nodeStatusIcon}
            name={node.style.icon.name}
            color={node.style.icon.color}
            size={20}
          ></Icon>
        )}

        {editing && (
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => {
              updateChecked(node);
            }}
          >
            {node.level == 1 && !itemsSelected && (
              <Checkbox
                status={
                  checkedDic[node.key] != undefined &&
                  checkedDic[node.key].checked
                    ? "checked"
                    : "unchecked"
                }
              ></Checkbox>
            )}

            {(node.level == 2 || node.level == 3) && !storagesSelected && (
              <Checkbox
                status={
                  checkedDic[node.key] != undefined &&
                  checkedDic[node.key].checked
                    ? "checked"
                    : "unchecked"
                }
              ></Checkbox>
            )}
          </TouchableOpacity>
        )}

        {!node.opened && hasDescendants && (
          <Icon
            style={styles.nodeChevronIcon}
            name="chevron-down"
            size={40}
          ></Icon>
        )}
        {node.opened && hasDescendants && (
          <Icon
            style={styles.nodeChevronIcon}
            name="chevron-up"
            size={40}
          ></Icon>
        )}
      </View>
    );
  };

  const getChildrenName = (node) => {
    return "descendants";
  };

  return (
    <View style={styles.container}>
      <Modal
        style={styles.loadingModal}
        transparent={true}
        visible={loadingModalVisible}
      >
        <View style={styles.loadingModalBackground}>
          <ActivityIndicator size="large"></ActivityIndicator>
        </View>
      </Modal>
      <NumberInputModal
        visible={numberInputModalVisible}
        onCancel={handleCancelNumberInputModal}
        onConfirm={handleNumberInputModal}
        placeholder={t("components.modal.units")}
      />
      <DropdownInputModal
        visible={dropdownInputModalVisible}
        onCancel={handleCancelDropdownInputModal}
        onConfirm={handleDropdownInputModal}
        placeholder={t("components.storage.selectStorage")}
        receivedItems={storages}
        sortText={true}
      ></DropdownInputModal>
      <TextInputModal
        visible={modalInputStorageVisible}
        onCancel={closeModalInputStorage}
        onConfirm={handleConfirmStorage}
        placeholder={t("components.storage.newStorageName")}
      />
      <Header
        callBackFunction={() => {
          navigation.goBack();
        }}
      ></Header>
      <View style={styles.allButtonContainer}>
        <Searchbar
          style={styles.searchbar}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
          }}
        ></Searchbar>
        <View style={styles.optionsContainer}>
          <Toggle
            style={styles.toggle}
            onPress={(newState) => {
              setToggleValue(newState);
              arrangeDataTree(storages, allProductsNotConsumed, newState);
            }}
            leftTitle={t("components.storage.alphabetic")}
            rightTitle={t("components.storage.date")}
            trackBar={styles.trackBar}
            trackBarStyle={styles.trackBarStyle}
            thumbButton={thumbStyle()}
          />
          <View style={styles.iconContainer}>
            <TouchableOpacity>
              <Icon
                onPress={() => {
                  setEditing(!editing);
                }}
                style={styles.icon}
                name="pencil"
                size={30}
                color={editing ? "grey" : "black"}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon
                onPress={() => setModalInputStorageVisible(true)}
                style={styles.icon}
                name="plus-circle-outline"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView style={styles.nestedListContainer}>
        <NestedListView
          data={data}
          getChildrenName={getChildrenName}
          renderNode={renderNode}
        />
      </ScrollView>
      {editing && (
        <View style={styles.bottomButtons}>
          {showDelete && (
            <TouchableOpacity
              style={styles.iconAndText}
              onPress={() => askDeleteSelectedElements()}
            >
              <Icon name="delete-outline" size={30} />
              <Text>{t("components.storage.buttonDelete")}</Text>
            </TouchableOpacity>
          )}
          {showDate && (
            <TouchableOpacity
              style={styles.iconAndText}
              onPress={() => showDatepicker()}
            >
              <Icon name="calendar-month-outline" size={30} />
              <Text>{t("components.storage.buttonDate")}</Text>
            </TouchableOpacity>
          )}
          {showMove && (
            <TouchableOpacity
              style={styles.iconAndText}
              onPress={() => {
                setDropdownInputModalVisible(true);
              }}
            >
              <Icon name="arrow-right-top" size={30} />
              <Text>{t("components.storage.buttonMove")}</Text>
            </TouchableOpacity>
          )}
          {showQuantity && (
            <TouchableOpacity
              style={styles.iconAndText}
              onPress={() => {
                setNumberInputModalVisible(true);
              }}
            >
              <Icon name="plus-minus-variant" size={30} />
              <Text>{t("components.storage.buttonQuantity")}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  loadingModal: { height: "100%", width: "100%" },
  loadingModalBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
  },
  allButtonContainer: {
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "column",
  },
  searchbar: {
    backgroundColor: "white",
  },
  optionsContainer: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
  },
  trackBar: {
    width: 200,
    height: 50,
    radius: 25,
    activeBackgroundColor: myColors.white,
    inActiveBackgroundColor: myColors.white,
  },
  trackBarStyle: {
    borderWidth: 2,
    borderRadius: 10,
  },
  thumbButtonAlphabetic: {
    borderWidth: 2,
    width: 100,
    height: 50,
    radius: 10,
    activeBackgroundColor: myColors.mainGrey,
    inActiveBackgroundColor: myColors.mainGreen,
  },
  thumbButtonDate: {
    borderWidth: 2,
    width: 100,
    height: 50,
    radius: 10,
    activeBackgroundColor: myColors.mainGreen,
    inActiveBackgroundColor: myColors.mainGrey,
    activeColor: myColors.white,
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    marginLeft: 60,
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  nestedListContainer: {
    marginTop: "10%",
    width: "100%",
  },
  node: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    borderWidth: 1,
    borderColor: "rgb(0, 0, 0)",
  },
  checkbox: {
    position: "absolute",
    right: 50,
    marginTop: 2,
  },
  nodeChevronIcon: {
    position: "absolute",
    right: 0,
    marginTop: 2,
  },
  nodeStatusIcon: {
    alignSelf: "center",
    marginLeft: 10,
  },
  level1: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  level2: { color: "#757575", fontWeight: "bold" },
  level3: { color: "#757575" },
  bottomButtons: {
    height: "8%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderWidth: 0.5,
  },
  iconAndText: {
    alignItems: "center",
  },
});
