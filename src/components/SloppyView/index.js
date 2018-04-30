import React from "react";
import { View } from "react-native";
import { Sizes } from "localyyz/constants";

export default class SloppyView extends React.Component {
  render() {
    return (
      <View
        hitSlop={{
          top: Sizes.InnerFrame,
          bottom: Sizes.InnerFrame,
          left: Sizes.InnerFrame,
          right: Sizes.InnerFrame
        }}
        {...this.props}/>
    );
  }
}
