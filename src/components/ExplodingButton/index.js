import React from "react";
import {
  View, StyleSheet, Text, TouchableOpacity
} from "react-native";
import {
  Colours, Sizes, Styles
} from "localyyz/constants";
import {
  randInt
} from "localyyz/helpers";

// third party
import * as Animatable from "react-native-animatable";

export default class ExplodingButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showExploder: false,
    };

    // bindings
    this.explode = this.explode.bind(this);
    this.reset = this.reset.bind(this);
  }

  explode() {

    // fade the icon
    this.props.shouldExplode !== false ? this.setState({
      showExploder: true
    }, () => {
      this.props.navigation.setParams({ gesturesEnabled: false });
      this.refs.container.fadeOut(100);
      this.refs.exploder.transitionTo({
        width: Sizes.Height * 2.2,
        height: Sizes.Height * 2.2,
        borderRadius: Sizes.Height,
        bottom: -Sizes.Height,
        right: -Sizes.Height
      });

      this.props.onPress && this.props.onPress();
    }): this.props.onPress && this.props.onPress();
  }

  reset() {
    this.setState({
      showExploder: false
    }, () => {

      // TODO: rather than true, should restore the original option prior to
      // exploding and blocking view
      this.props.navigation.setParams({ gesturesEnabled: true });
      this.refs.container.fadeIn();
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showExploder && (
          <Animatable.View
            ref="exploder"
            style={[styles.exploder, this.props.color && {
              backgroundColor: this.props.color}]} />)}
        <Animatable.View ref="container">
          <TouchableOpacity onPress={() => this.explode()}>
            {this.props.children}
          </TouchableOpacity>
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },

  exploder: {
    position: "absolute",
    width: 1,
    height: 1,
    borderRadius: 1,
    backgroundColor: Colours.SecondGradient
  }
});
