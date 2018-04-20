import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import PropTypes from "prop-types";

// custom
import { UppercasedText } from "localyyz/components";

// third party
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";

export default class Button extends React.Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    badge: PropTypes.string,
    isActive: PropTypes.bool,
    entypo: PropTypes.bool
  };

  static defaultProps = {
    badge: null,
    isActive: false,
    entypo: false
  };

  get buttonColor() {
    return this.props.isActive ? Colours.Text : Colours.SubduedText;
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View
          hitSlop={{
            top: Sizes.InnerFrame,
            bottom: Sizes.InnerFrame,
            left: Sizes.InnerFrame,
            right: Sizes.InnerFrame
          }}
          style={styles.container}>
          {this.props.entypo ? (
            <EntypoIcon
              name={this.props.icon}
              size={Sizes.IconButton}
              color={this.buttonColor}
            />
          ) : (
            <MaterialCommunityIcon
              name={this.props.icon}
              size={Sizes.IconButton}
              color={this.buttonColor}
            />
          )}
          <UppercasedText style={styles.buttonLabel}>
            {this.props.label}
          </UppercasedText>
          {this.props.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>{this.props.badge}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.TinyText,
    marginTop: Sizes.InnerFrame / 6
  },

  badge: {
    backgroundColor: Colours.Secondary,
    borderRadius: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 6,
    paddingHorizontal: Sizes.InnerFrame / 2,
    position: "absolute",
    right: -Sizes.InnerFrame / 2,
    bottom: Sizes.InnerFrame * 2 / 3
  },

  badgeLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText,
    ...Styles.Alternate
  }
});
