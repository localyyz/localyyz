import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

// custom
import { Sizes, Colours } from "localyyz/constants";
import { ProductList } from "localyyz/components";

// third party
import Placeholder from "rn-placeholder";

export default class MainPlaceholder extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <StatusBar barStyle="dark-content" />
        <Placeholder.Box
          width={Sizes.Width}
          height={Sizes.Height / 2}
          animate="fade"/>
        <View style={styles.products}>
          <ProductList.Placeholder />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  products: {
    paddingVertical: Sizes.InnerFrame
  }
});
