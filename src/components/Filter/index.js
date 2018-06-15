import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// local
import {
  Price,
  Discount,
  Sort,
  Categories,
  Gender,
  ProductCount
} from "./components";
import FilterStore from "./store";

export default class Filter extends React.Component {
  static getNewStore(searchStore, initParams = {}) {
    return new FilterStore(searchStore, initParams);
  }

  render() {
    return (
      <View style={styles.container}>
        <ProductCount />
        <Text style={styles.header}>Sort</Text>
        <Sort />
        <View style={styles.spacer} />
        <Text style={styles.header}>Filters</Text>
        <Text style={styles.label}>By price</Text>
        <Price />
        <Text style={styles.label}>By minimum discount %</Text>
        <Discount />
        <Text style={styles.label}>By gender</Text>
        <Gender />
        <Categories />
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
