import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SwipeListView } from "react-native-swipe-list-view";

export default function SwipeComponent({
  products,
  functionEdit,
  functionDelete,
}) {
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const editRow = (rowMap, rowKey, data) => {
    closeRow(rowMap, rowKey);
    functionEdit(data.item.key);
  };

  const deleteRow = (rowMap, rowKey, data) => {
    closeRow(rowMap, rowKey);
    functionDelete(data.item.key);
  };

  const renderItem = (data) => (
    <View style={styles.rowFront} underlayColor={"#AAA"}>
      <View style={styles.rowFrontContainer}>
        <View>
          <View style={[styles.circle, { backgroundColor: data.item.color }]}>
            <Text style={styles.expiracyDays}>{data.item.remainingTime}</Text>
            <Text style={styles.expiracyFormat}>
              {data.item.remainingTimeCharacter}
            </Text>
          </View>
        </View>
        <View style={styles.rowFrontText}>
          <Text style={styles.itemName}>
            {data.item.name + " (" + data.item.quantity + ")"}
          </Text>
          <View style={styles.itemInfo}>
            <Text style={styles.itemBrand}>{data.item.brand}</Text>
            <Text> - </Text>
            <Text style={styles.itemLocation}>{data.item.storage}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.buttonRemove]}
        onPress={() => deleteRow(rowMap, data.key, data)}
      >
        <Image source={require("../assets/delete.png")} style={styles.trash} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonEdit]}
        onPress={() => editRow(rowMap, data.key, data)}
      >
        <Image source={require("../assets/edit.png")} style={styles.trash} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SwipeListView
        data={products}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-120}
        previewRowKey={"0"}
        previewOpenValue={0.01}
        previewOpenDelay={3000}
        disableRightSwipe={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 10,
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    borderRadius: 52,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 0.5,
    height: 50,
    marginTop: 10,
  },
  rowFrontContainer: {
    flex: 1,
    flexDirection: "row",
  },
  circle: {
    width: 50,
    height: 50,
    marginTop: 0,
    marginLeft: 0,
    borderRadius: 100 / 2,
    borderWidth: 0.5,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  expiracyDays: {
    color: "white",
    fontSize: 30,
    marginLeft: 11,
  },
  expiracyFormat: {
    color: "white",
    fontSize: 15,
    marginTop: 16,
  },
  rowFrontText: {
    marginLeft: 20,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  rowBack: {
    borderRadius: 52,
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  buttonEdit: {
    marginRight: 15,
  },
  buttonRemove: {
    marginRight: 30,
  },
  trash: {
    height: 25,
    width: 25,
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
  },
});
