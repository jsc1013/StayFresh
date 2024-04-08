import React, { useState } from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { myColors } from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { i18next } from "../services/i18next";

const TextInputModal = ({ visible, onCancel, onConfirm, placeholder }) => {
  const [text, setText] = useState("");
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm(text);
    setText("");
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onCancel}>
      <View style={styles.background}>
        <View style={styles.inputArea}>
          <TextInput
            placeholder={placeholder}
            value={text}
            onChangeText={setText}
            style={styles.input}
            theme={{ colors: { primary: "gray" } }}
          />
          <View style={styles.buttonsContainer}>
            <Button
              mode="contained-tonal"
              onPress={() => {
                setText("");
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

export default TextInputModal;

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
