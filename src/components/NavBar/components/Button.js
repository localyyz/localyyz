import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import PropTypes from "prop-types";

// custom
import { SloppyView } from "localyyz/components";

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
        <SloppyView style={styles.container}>
          {this.props.entypo ? (
            <EntypoIcon
              name={this.props.icon}
              size={Sizes.IconButton}
              color={this.buttonColor}/>
          ) : (
            <MaterialCommunityIcon
              name={this.props.icon}
              size={Sizes.IconButton}
              color={this.buttonColor}/>
          )}
          <Text style={styles.buttonLabel}>{this.props.label}</Text>
          {this.props.badge ? (
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>{this.props.badge}</Text>
              </View>
            </View>
          ) : null}
        </SloppyView>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 6
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.TabBarText
  },

  badgeContainer: {
    position: "absolute",
    left: 0,
    right: Sizes.InnerFrame / 2,
    bottom: Sizes.InnerFrame * 2 / 3,
    alignItems: "flex-end"
  },

  badge: {
    backgroundColor: Colours.Secondary,
    borderRadius: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 6,
    paddingHorizontal: Sizes.InnerFrame / 3
  },

  badgeLabel: {
    ...Styles.Text,
    ...Styles.TabBarText,
    ...Styles.Emphasized,
    ...Styles.Alternate
  }
});
