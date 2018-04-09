import React from "react";
import {
  View, StyleSheet, Text
} from "react-native";
import {
  Colours, Sizes, Styles
} from "localyyz/constants";

// custom
import {
  UppercasedText
} from "localyyz/components";

export default class CartHeader extends React.Component {
  render() {
    return (
      <View style={[Styles.Horizontal, styles.container]}>
        <UppercasedText style={[
          Styles.Text, Styles.Emphasized, styles.titleLabel]}>
          {this.props.title}
        </UppercasedText>
        <View style={[Styles.Horizontal, styles.content]}>
          <Text style={[
            Styles.Text, Styles.Terminal, styles.contentLabel]}>
            {this.props.children}
          </Text>
        </View>
        {this.props.icon}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    justifyContent: "center"
  },

  content: {
    flex: 1,
    marginLeft: Sizes.InnerFrame
  }
});
