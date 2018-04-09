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
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default class CartField extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.span, this.props.style]}>
        <View style={[Styles.Horizontal, styles.container]}>
          <TouchableOpacity onPress={this.props.onIconPress}>
            <Animatable.View
              animation="zoomIn"
              duration={300}
              delay={randInt(200) + 200}>
              <MaterialIcon name={this.props.icon || "work"} size={Sizes.IconButton / 2} color={this.props.color || Colours.Text} />
            </Animatable.View>
          </TouchableOpacity>
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  span: {
    flex: 1
  },

  container: {
    flex: 1,
    paddingLeft: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2
  }
});
