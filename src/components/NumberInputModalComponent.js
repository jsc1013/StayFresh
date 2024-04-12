import React, { useState } from "react";
import { Modal, View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { myColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { i18next } from "../services/i18next";

const NumberInputModal = ({ visible, onCancel, onConfirm, placeholder }) => {
  const [number, setNumber] = useState("");
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm(number);
    setNumber("");
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onCancel}>
      <View style={styles.background}>
        <View style={styles.inputArea}>
          <TextInput
            keyboardType="numeric"
            placeholder={placeholder}
            value={number}
            onChangeText={setNumber}
            style={styles.input}
            theme={{ colors: { primary: "gray" } }}
          />
          <View style={styles.buttonsContainer}>
            <Button
              mode="contained-tonal"
              onPress={() => {
                setNumber("");
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

export default NumberInputModal;

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
  input: {
    height: 60,
    borderColor: "gray",
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 0,
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
});
