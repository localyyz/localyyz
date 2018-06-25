import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";
import UppercasedText from "../UppercasedText";
import PropTypes from "prop-types";

// third party
import { View as AnimatableView } from "react-native-animatable";
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";

import Popup from "./Popup";

export class Button extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,

    text: PropTypes.string,
    isInitialVisible: PropTypes.bool,
    onPress: PropTypes.func
  };

  static defaultProps = {
    text: "Filter / Sort",
    isInitialVisible: false
  };

  componentDidMount() {
    this.props.isInitialVisible ? this.onPress() : null;
  }

  onPress = () => {
    this.props.onPress
      ? this.props.onPress()
      : this.props.navigation.navigate("Modal", {
          component: <Popup {...this.props} />
        });
  };

  render() {
    return (
      <View style={styles.toggle} pointerEvents="box-none">
        <LinearGradient
          colors={[Colours.WhiteTransparent, Colours.Transparent]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradient}
          pointerEvents="box-none">
          <TouchableOpacity onPress={this.onPress}>
            <AnimatableView
              animation="fadeIn"
              duration={500}
              delay={1000}
              style={styles.toggleContainer}>
              <MaterialIcon
                name="sort"
                size={Sizes.TinyText}
                color={Colours.Text}/>
              <UppercasedText style={styles.toggleLabel}>
                {this.props.text}
              </UppercasedText>
            </AnimatableView>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
}

export default withNavigation(Button);

const styles = StyleSheet.create({
  gradient: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: Sizes.Height / 6
  },

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
