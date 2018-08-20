import React from "react";
import { View, StyleSheet } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";

export default class CartBaseContent extends React.Component {
  render() {
    return (
      <View {...this.props} style={[styles.container, this.props.style]} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Sizes.InnerFrame,
    marginTop: Sizes.InnerFrame,
    padding: Sizes.InnerFrame,
    height: Sizes.Height * 2 / 3 - Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  }
});
