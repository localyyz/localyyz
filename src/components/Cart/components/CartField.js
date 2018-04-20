import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { randInt } from "localyyz/helpers";

// custom
import { UppercasedText } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default class CartField extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    label: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    onPress: PropTypes.func,
    onIconPress: PropTypes.func
  };

  static defaultProps = {
    label: "",
    icon: "work",
    color: Colours.Text
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={[styles.container, this.props.style]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={this.props.onIconPress}>
            <Animatable.View
              animation="zoomIn"
              duration={300}
              delay={randInt(200) + 200}
              style={styles.iconContainer}>
              <MaterialIcon
                name={this.props.icon}
                size={Sizes.IconButton / 2}
                color={this.props.color}
              />
            </Animatable.View>
          </TouchableOpacity>
          <UppercasedText
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.label, { color: this.props.color }]}>
            {this.props.label}
          </UppercasedText>
        </View>
        <View style={styles.children}>{this.props.children}</View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Sizes.InnerFrame
  },

  header: {
    ...Styles.Horizontal,
    paddingBottom: Sizes.InnerFrame / 4
  },

  label: {
    ...Styles.Text,
    ...Styles.TinyText,
    flex: 1,
    marginLeft: Sizes.InnerFrame / 4
  }
});
