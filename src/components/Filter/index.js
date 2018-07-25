import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

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
  static getNewStore(searchStore, userStore) {
    return new FilterStore(searchStore, userStore);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Filters</Text>
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

  header: {
    ...Styles.Text,
    ...Styles.Title,
    marginBottom: Sizes.InnerFrame
  },

  label: {}
});
