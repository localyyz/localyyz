import React from "react";
import { View, StyleSheet, Text } from "react-native";

// custom
import Support from "~/src/components/Support";
import { Styles, Sizes } from "localyyz/constants";

export default class EmptyOrders extends React.Component {
  render() {
    return (
      <Support title="Need help?">
        <View style={styles.container}>
          <Text style={styles.label}>
            You have no previously completed orders
          </Text>
        </View>
      </Support>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Sizes.InnerFrame
  },

  label: {
    ...Styles.Text,
    textAlign: "center"
  }
});
