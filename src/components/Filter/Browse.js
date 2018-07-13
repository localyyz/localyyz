import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// local
import {
  GenderCategories,
} from "./components";
import FilterStore from "./store";

export { ProductCount } from "./components";

export default class Browse extends React.Component {
  static getNewStore(searchStore) {
    return new FilterStore(searchStore);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Category</Text>
        <GenderCategories />
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

});
