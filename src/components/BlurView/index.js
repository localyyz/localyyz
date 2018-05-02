import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Colours } from "localyyz/constants";

// third party
import { BlurView as BlurViewIOS } from "react-native-blur";

export default class BlurView extends React.Component {
  render() {
    return Platform.OS === "ios" ? (
      <BlurViewIOS {...this.props} />
    ) : (
      <View {...this.props} style={[styles.android, this.props.style]} />
    );
  }
}

const styles = StyleSheet.create({
  android: {
    backgroundColor: Colours.WhiteTransparent
  }
});
