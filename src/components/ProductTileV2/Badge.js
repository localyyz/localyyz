import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

// third party
//import EntypoIcon from "react-native-vector-icons/Entypo";
import { observer } from "mobx-react/native";

// custom
import { Sizes, Styles } from "~/src/constants";

export const BadgeType = {
  Deal: 1,
  New: 2,
  Trend: 3,
  BestSell: 4,
  Feature: 9
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

  render() {
    return (
      <View style={styles.icon}>
        <Text style={styles.text}>{this.badgeText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    ...Styles.RoundedButton,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  text: {
    ...Styles.RoundedButtonText,
    fontSize: Sizes.TinyText
  }
});
