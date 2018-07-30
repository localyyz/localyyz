import React from "react";
import { View, StyleSheet } from "react-native";

// local
import {
  Price,
  Discount,
  Brands,
  Sizes as SizesFilter,
  Colors,
  Gender
} from "./components";
import FilterStore from "./store";

export { ProductCount } from "./components";

export default class Filter extends React.Component {
  static Gender = Gender;
  static getNewStore(...params) {
    return new FilterStore(...params);
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Price />
        <Discount />
        <Brands headerStyle={styles.label} />
        <Colors headerStyle={styles.label} />
        <SizesFilter headerStyle={styles.label} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  label: {}
});
