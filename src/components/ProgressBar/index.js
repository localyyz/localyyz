import React from "react";
import { View, StyleSheet, Animated } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";

export default class ProgressBar extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.progress,
            this.props.progress && {
              width: this.props.progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
                extrapolate: "clamp"
              })
            }
          ]}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Sizes.InnerFrame / 2,
    width: "100%",
    backgroundColor: Colours.Accented
  },

  progress: {
    height: "100%",
    width: "0%",
    backgroundColor: Colours.Primary
  }
});
