import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// local
import {
  Price,
  Discount,
  Sort,
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
        <Price/>
        <Discount/>
        <Brands headerStyle={styles.label}/>
        <Colors headerStyle={styles.label}/>
        <SizesFilter headerStyle={styles.label}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

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
