import React from "react";
import {
  Text
} from "react-native";

export default class UppercasedText extends React.Component {
  render() {
    return (
      <Text {...this.props}>
        {this.props.children.toUpperCase()}
      </Text>
    )
  }
}
