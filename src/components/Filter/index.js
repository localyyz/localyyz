import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// local
import { Price, Discount, Sort, Categories } from "./components";
import FilterStore from "./store";

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
        {this.props.categories && this.props.categories.length > 0 ? (
          <View>
            <Text style={styles.label}>By type</Text>
            <Categories categories={this.props.categories} />
          </View>
        ) : null}
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