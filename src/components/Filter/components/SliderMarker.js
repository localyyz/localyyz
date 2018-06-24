import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";

export default class SliderMarker extends React.Component {
  static propTypes = {
    currentValue: PropTypes.node.isRequired,
    isMoving: PropTypes.bool,
    type: PropTypes.string
  };

  static defaultProps = {
    isMoving: false,
    type: "price"
  };

  get label() {
    switch (this.props.type) {
      case "discount":
        return `${(this.props.currentValue * 100).toFixed(0)}%`;
      case "price":
      default:
        return this.props.currentValue
          ? `$${this.props.currentValue.toFixed(2)}`
          : "Free";
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.labelAnimation}>
          <Animatable.View
            animation={this.props.pressed ? "slideInUp" : "fadeOut"}
            duration={300}
            style={styles.labelContainer}>
            <Text numberOfLines={1} style={styles.label}>
              {this.props.pressed ? this.label : ""}
            </Text>
          </Animatable.View>
        </View>
        <View style={styles.spacer} />
        <View style={styles.marker} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Sizes.OuterFrame * 3,
    height: Sizes.OuterFrame * 2,
    alignItems: "center"
  },

  spacer: {
    height: Sizes.InnerFrame / 2
  },

  labelAnimation: {
    overflow: "hidden",
    height: Sizes.InnerFrame,
    width: Sizes.OuterFrame * 3,
    alignItems: "center",
    justifyContent: "center"
  },

  label: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized
  },

  marker: {
    height: Sizes.InnerFrame,
    width: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.Selected
  }
});
