import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { observer, inject } from "mobx-react/native";
import * as Animatable from "react-native-animatable";

import Icon from "react-native-vector-icons/Entypo";
import { Colours, Sizes, Styles } from "~/src/constants";

// there is an issue with safe area view with react navigation modal
// and for some reason adding top level padding breaks swiper (probably because
// it relies on onLayout to do some state calculation)
const SlidePaddingTop = Sizes.ScreenTop + Sizes.OuterFrame * 3;

@inject((stores, props) => ({
  onboardingStore: stores.onboardingStore,
  active: stores.onboardingStore.activeSlideKey === props.id
}))
@observer
export default class Slide extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: "center",
            height: Sizes.Width / 2,
            minHeight: Sizes.Width / 2
          }}>
          {this.props.imageSrc ? (
            <Animatable.Image
              animation={this.props.active ? "zoomIn" : ""}
              source={{ uri: this.props.imageSrc }}
              style={{
                width: Sizes.Width / 2,
                height: Sizes.Width / 2
              }}/>
          ) : (
            <Icon
              color={Colours.Primary}
              size={Sizes.SquareButton}
              name={this.props.iconSrc}/>
          )}
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center"
          }}>
          <Text style={styles.title}>{this.props.line1}</Text>
          <Text style={styles.title}>{this.props.line2}</Text>
          <View
            style={{
              minHeight: Sizes.Height / 5,
              paddingTop: Sizes.InnerFrame / 2
            }}>
            <Text style={styles.subtitle}>{this.props.line3}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SlidePaddingTop,
    paddingBottom: Sizes.InnerFrame,
    paddingHorizontal: 2 * Sizes.InnerFrame / 3,
    justifyContent: "center",
    alignItems: "center",
    minHeight: Sizes.InnerFrame * 3,
    backgroundColor: Colours.Transparent
  },

  title: {
    ...Styles.Emphasized,
    fontSize: Sizes.Text,
    textAlign: "center",
    lineHeight: Sizes.LineHeightOneHalf
  },

  subtitle: {
    ...Styles.Subtitle,
    fontSize: Sizes.Text,
    textAlign: "center",
    lineHeight: Sizes.LineHeightOneHalf
  }
});
