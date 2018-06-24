import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// local
import {
  Price,
  Discount,
  Sort,
  GenderCategories,
  Brands,
  Sizes as SizesFilter,
  Colors
} from "./components";
import FilterStore from "./store";

export { ProductCount } from "./components";

export default class Filter extends React.Component {
  static getNewStore(searchStore) {
    return new FilterStore(searchStore);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Sort</Text>
        <Sort />
        <View style={styles.spacer} />

        <Text style={styles.header}>Filters</Text>
        <Text style={styles.label}>By price</Text>
        <Price />
        <Text style={styles.label}>By minimum discount %</Text>
        <Discount />

        <GenderCategories />

        <Brands />
        <Colors />
        <SizesFilter />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  spacer: {
    height: Sizes.OuterFrame
  },

  header: {
    ...Styles.Text,
    ...Styles.Title,
    marginBottom: Sizes.InnerFrame
  },

  label: {}
});
