import React from "react";
import { View, Image, TouchableWithoutFeedback } from "react-native";

// custom
import { capitalize } from "localyyz/helpers";
import { Colours, Sizes } from "localyyz/constants";

// third party
import { withNavigation } from "react-navigation";

export class Banner extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.navigation.push("ProductList", {
      fetchPath: this.props.path,
      title: capitalize(this.props.title),
      description: this.props.description
    });
  }

  render() {
    return this.props.imageUri ? (
      <TouchableWithoutFeedback
        style={{ backgroundColor: Colours.Foreground }}
        onPress={this.onPress}>
        <Image
          source={{
            uri: this.props.imageUri,
            width: Sizes.getSizeForScreen(this.props.imageWidth),
            height: Sizes.getSizeForScreen(this.props.imageHeight)
          }}/>
      </TouchableWithoutFeedback>
    ) : (
      <View />
    );
  }
}

export default withNavigation(Banner);
