import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Sizes, Styles } from "localyyz/constants";

// third party
import PropTypes from "prop-types";

export default class CartHeader extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    icon: PropTypes.node
  };

  static defaultProps = {
    title: ""
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <View style={styles.content}>
          <Text style={styles.contentLabel}>{this.props.children}</Text>
        </View>
        {this.props.icon}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    flex: 1,
    marginHorizontal: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame,
    alignItems: "center"
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  content: {
    ...Styles.Horizontal,
    flex: 1,
    marginHorizontal: Sizes.InnerFrame / 2
  },

  contentLabel: {
    ...Styles.Text
  }
});
