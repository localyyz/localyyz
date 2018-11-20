import React from "react";
import { Animated, View, Text, StyleSheet } from "react-native";

import Entypo from "react-native-vector-icons/Entypo";
import Material from "react-native-vector-icons/MaterialIcons";
import { Colours, Sizes, Styles } from "~/src/constants";

// there is an issue with safe area view with react navigation modal
// and for some reason adding top level padding breaks swiper (probably because
// it relies on onLayout to do some state calculation)
const SlidePaddingTop = Sizes.ScreenTop + Sizes.OuterFrame * 3;

export default class Slide extends React.Component {
  render() {
    const Icon = this.props.iconTyle == "MaterialIcons" ? Material : Entypo;

    return (
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: this.props.backgroundColor }
        ]}>
        <View
          style={{
            justifyContent: "center",
            height: Sizes.Width / 2,
            minHeight: Sizes.Width / 2
          }}>
          <Icon
            color={Colours.Foreground}
            size={Sizes.SquareButton}
            name={this.props.iconSrc}/>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center"
          }}>
          <Text style={styles.title}>{this.props.line1}</Text>
          <Text style={styles.subtitle}>{this.props.line2}</Text>
          <View
            style={{
              minHeight: Sizes.Height / 5,
              paddingTop: Sizes.InnerFrame
            }}>
            <Text style={styles.subtitle}>{this.props.line3}</Text>
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SlidePaddingTop,
    paddingBottom: Sizes.InnerFrame,
    paddingHorizontal: Sizes.InnerFrame,
    justifyContent: "center",
    alignItems: "center",
    minHeight: Sizes.InnerFrame * 3,
    backgroundColor: Colours.Transparent
  },

  title: {
    ...Styles.Emphasized,
    fontSize: Sizes.H1,
    textAlign: "center",
    lineHeight: Sizes.LineHeightOneHalf,
    color: Colours.Foreground
  },

  subtitle: {
    ...Styles.Subtitle,
    fontSize: Sizes.SmallText,
    textAlign: "center",
    color: Colours.Foreground
  }
});
