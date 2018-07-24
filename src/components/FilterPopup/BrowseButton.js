import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";
import UppercasedText from "../UppercasedText";
import PropTypes from "prop-types";

// third party
import { View as AnimatableView } from "react-native-animatable";
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import Popup from "./BrowsePopup";

export class BrowseButton extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    isInitialVisible: PropTypes.bool,
    onPress: PropTypes.func
  };

  static defaultProps = {
    text: "Browse",
    isInitialVisible: false
  };

  onPress = () => {
    this.props.onPress
      ? this.props.onPress()
      : this.props.navigation.navigate({
          routeName: "Modal",
          params: {
            component: <Popup {...this.props} />
          }
        });
  };

  render() {
    return (
      <View style={styles.toggle} pointerEvents="box-none">
        <TouchableOpacity onPress={this.onPress}>
          <AnimatableView
            animation="fadeIn"
            duration={500}
            delay={1000}
            style={styles.toggleContainer}>
            <MaterialIcon
              name="change-history"
              size={Sizes.TinyText}
              color={Colours.Text}/>
            <UppercasedText style={styles.toggleLabel}>
              {this.props.text}
            </UppercasedText>
          </AnimatableView>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(BrowseButton);

const styles = StyleSheet.create({
  toggleContainer: {
    ...Styles.Horizontal,
    margin: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.WhiteTransparent,
    shadowColor: Colours.DarkTransparent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    alignItems: "center",
    justifyContent: "center"
  },

  toggleLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Medium,
    marginLeft: Sizes.InnerFrame / 2
  }
});
