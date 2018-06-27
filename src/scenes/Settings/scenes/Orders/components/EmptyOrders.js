import React from "react";
import { View, StyleSheet, Text } from "react-native";

// custom
import { Styles, Sizes } from "localyyz/constants";

export default class EmptyOrders extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          You have no previously completed orders
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Sizes.OuterFrame
  },

  label: {
    ...Styles.Text
  }
});
