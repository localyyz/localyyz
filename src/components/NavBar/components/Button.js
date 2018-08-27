import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";
import PropTypes from "prop-types";

// custom
import { SloppyView } from "localyyz/components";

// third party
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

export default class Button extends React.Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    // button id to sync group activation and deactivation
    id: PropTypes.string.isRequired,
    activeButton: PropTypes.string.isRequired,

    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    badge: PropTypes.string,

    iconType: PropTypes.string
  };

  static defaultProps = {
    badge: null
  };

  static getDerivedStateFromProps(props) {
    return {
      isActive:
        props.activeButton == "cart" ? props.activeButton == props.id : true
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      isActive: props.activeButton == props.id
    };
  }

  get buttonColor() {
    return this.props.activeButton === "deals"
      ? Colours.AlternateText
      : this.state.isActive ? Colours.Text : Colours.SubduedText;
  }

  get icon() {
    switch (this.props.iconType) {
      case "entypo":
        return EntypoIcon;
      case "fontAwesome":
        return FontAwesomeIcon;
      case "material":
        return MaterialIcon;
      default:
        return MaterialCommunityIcon;
    }
  }

  onPress = () => {
    this.setState({ isActive: true });

    // propagate
    this.props.onPress();
  };

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View key={this.props.label} style={styles.container}>
          <this.icon
            name={this.props.icon}
            size={Sizes.IconButton}
            color={this.buttonColor}/>
          <Text style={[styles.buttonLabel, { color: this.buttonColor }]}>
            {this.props.label}
          </Text>
          {this.props.badge ? (
            <View style={styles.badgeContainer}>
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>{this.props.badge}</Text>
              </View>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 4
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.TabBarText,
    height: Sizes.InnerFrame
  },

  badgeContainer: {
    position: "absolute",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    left: 0,
    right: Sizes.InnerFrame / 2,
    bottom: Sizes.InnerFrame
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
