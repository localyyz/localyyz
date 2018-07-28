import React from "react";
import { View, StyleSheet } from "react-native";

// custom
import { Styles, Sizes } from "localyyz/constants";

// third party
import Placeholder from "rn-placeholder";

// local
import CategoryButtonPlaceholder from "./CategoryButtonPlaceholder";

export default class CategoryPlaceholder extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Placeholder.Line animate="shine" textSize={Sizes.H2} width="40%" />
        <View style={styles.list}>
          <CategoryButtonPlaceholder />
          <CategoryButtonPlaceholder />
          <CategoryButtonPlaceholder />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame / 2
  },

  list: {
    ...Styles.Horizontal,
    marginTop: Sizes.InnerFrame
  }
});
