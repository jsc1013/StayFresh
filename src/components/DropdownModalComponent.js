import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { myColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { i18next } from "../services/i18next";
import DropDownPicker from "react-native-dropdown-picker";

const DropdownInputModal = ({
  visible,
  onCancel,
  onConfirm,
  placeholder,
  receivedItems,
  sortText,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    orderedItems = [...receivedItems];
    if (sortText) {
      orderedItems.sort();
    } else {
      orderedItems.sort(function (a, b) {
        return a - b;
      });
    }
    tempItems = [];
    orderedItems.forEach((element) => {
      tempItems.push({ label: element, value: element });
    });
    setItems(tempItems);
  }, [receivedItems]);

  const handleConfirm = () => {
    if (value == "") {
      return;
    }
    onConfirm(value);
    setValue("");
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onCancel}>
      <View style={styles.background}>
        <View style={styles.inputArea}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            theme="LIGHT"
            multiple={false}
            mode="SIMPLE"
            placeholder={placeholder}
            style={styles.dropdown}
            showArrowIcon={true}
            listMode="SCROLLVIEW"
          />
          <View style={styles.buttonsContainer}>
            <Button
              mode="contained-tonal"
              onPress={() => {
                setValue("");
                onCancel();
              }}
              style={{
                marginRight: 30,
              }}
              theme={{
                colors: {
                  secondaryContainer: myColors.mainRed,
                  onSecondaryContainer: myColors.white,
                },
              }}
            >
              {t("general.cancel")}
            </Button>
            <Button
              mode="contained-tonal"
              onPress={handleConfirm}
              theme={{
                colors: {
                  secondaryContainer: myColors.mainGreen,
                  onSecondaryContainer: myColors.white,
                },
              }}
            >
              {t("general.update")}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DropdownInputModal;

const styles = StyleSheet.create({
  background: {
    height: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  inputArea: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  dropdown: {
    width: "100%",
    height: 60,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 6,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
});
