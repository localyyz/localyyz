import React from "react";
import { View, StyleSheet } from "react-native";

// custom
import { ProductTile } from "localyyz/components";
import { Styles } from "localyyz/constants";

// constants
const NUM_TILES = 4;

export default class ProductListPlaceholder extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {new Array(this.props.limit || NUM_TILES)
          .fill()
          .map((node, i) => <ProductTile.Placeholder key={i} />)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    flexWrap: "wrap"
  }
});
