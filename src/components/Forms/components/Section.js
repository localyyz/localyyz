import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import PropTypes from "prop-types";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";

export default class BaseField extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    hasMargin: PropTypes.bool,
    label: PropTypes.string
  };

  static defaultProps = {
    hasMargin: true
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.style,
          this.props.hasMargin && styles.containerMargin
        ]}>
        <View style={styles.header}>
          <Text style={styles.label}>{this.props.label}</Text>
        </View>
        <View style={styles.content}>{this.props.children}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  containerMargin: {
    marginBottom: Sizes.InnerFrame / 2
  },

  header: {
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2
  },

  label: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized
  },

  content: {}
});
