import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

// third party
import EntypoIcon from "react-native-vector-icons/Entypo";
import { observer } from "mobx-react/native";

// custom
import { Sizes, Styles, Colours } from "~/src/constants";

export const BadgeType = {
  Deal: 1,
  New: 2,
  Trend: 3,
  BestSell: 4,
  Feature: 9,
  Unknown: 99
};

@observer
export default class Badge extends React.Component {
  static propTypes = {
    badgeType: PropTypes.number
  };

  get badgeText() {
    switch (this.props.badgeType) {
      case BadgeType.Deal:
        return "Best Deal";
      case BadgeType.New:
        return "Just In";
      case BadgeType.Trend:
        return "Trending";
      case BadgeType.BestSell:
        return "Best Selling";
      case BadgeType.Feature:
        return "Featured";
    }
  }

  get badgeIcon() {
    switch (this.props.badgeType) {
      case BadgeType.Unknown:
        return "help";
    }
  }

  render() {
    return (
      <View
        style={[
          styles.badge,
          { backgroundColor: this.props.badgeColor || Colours.Primary }
        ]}>
        <Text style={styles.text}>
          {this.props.text || this.props.badgeText}
        </Text>
        {this.badgeIcon ? (
          <EntypoIcon name={this.badgeIcon} style={styles.icon} />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    ...Styles.RoundedButton,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  text: {
    ...Styles.RoundedButtonText,
    fontSize: Sizes.TinyText
  },
  icon: {
    ...Styles.RoundedButtonText,
    fontSize: Sizes.TinyText
  }
});
