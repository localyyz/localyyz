import React from "react";
import { View, StyleSheet, Animated } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

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
          ]}>
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.label,
              styles.leftLabel,
              this.props.padding && { paddingRight: this.props.padding },
              this.props.progress && {
                opacity: this.props.progress.interpolate({
                  inputRange: [0, 0.5, 0.53, 1],
                  outputRange: [0, 0, 1, 1],
                  extrapolate: "clamp"
                })
              }
            ]}>
            {`${Math.round(this.props.percentage * 100)}% claimed`}
          </Animated.Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.remaining,
            this.props.progress && {
              width: this.props.progress.interpolate({
                inputRange: [0, 1],
                outputRange: ["100%", "0%"],
                extrapolate: "clamp"
              })
            }
          ]}>
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.label,
              styles.rightLabel,
              this.props.padding && { paddingLeft: this.props.padding },
              this.props.progress && {
                opacity: this.props.progress.interpolate({
                  inputRange: [0, 0.47, 0.53, 1],
                  outputRange: [1, 1, 0, 0],
                  extrapolate: "clamp"
                })
              }
            ]}>
            {`${Math.round(this.props.percentage * 100)}% claimed`}
          </Animated.Text>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    height: Sizes.OuterFrame,
    width: "100%",
    backgroundColor: Colours.Accented
  },

  progress: {
    height: "100%",
    width: "0%",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: Colours.Primary
  },

  remaining: {
    height: "100%",
    width: "0%",
    alignItems: "flex-start",
    justifyContent: "center"
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    ...Styles.TinyText
  },

  leftLabel: {
    paddingLeft: Sizes.InnerFrame / 2,
    paddingRight: Sizes.InnerFrame
  },

  rightLabel: {
    paddingLeft: Sizes.InnerFrame,
    paddingRight: Sizes.InnerFrame / 2
  }
});
