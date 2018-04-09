import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { randInt } from "localyyz/helpers";

// third party
import * as Animatable from "react-native-animatable";

export default class SearchTag extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Animatable.View
          animation="bounceIn"
          delay={randInt(500) + this.props.delay || 100}
          duration={this.props.duration || 400}
          style={[
            styles.container,
            this.props.color && {
              backgroundColor: this.props.color
            }
          ]}>
          <Text style={styles.label}>{this.props.children || ""}</Text>
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: Sizes.InnerFrame / 4,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    borderRadius: Sizes.OuterFrame,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.MenuBackground
  },

  label: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Emphasized,
    ...Styles.Alternate
  }
});
