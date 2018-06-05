import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Sizes, Colours } from "localyyz/constants";

// third party
import Placeholder from "rn-placeholder";

// local
import ListPlaceholder from "./ListPlaceholder";

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
          <ListPlaceholder />
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
    marginVertical: Sizes.InnerFrame / 2,
    padding: Sizes.InnerFrame / 2,
    paddingVertical: Sizes.InnerFrame
  }
});
