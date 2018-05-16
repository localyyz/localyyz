import React from "react";
import { TouchableOpacity } from "react-native";
import { Sizes } from "localyyz/constants";

// custom
import ParallaxPhoto from "./ParallaxPhoto";
import { capitalize } from "localyyz/helpers";

// third party
import { withNavigation } from "react-navigation";

@withNavigation
export default class Banner extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.navigation.navigate("ProductList", {
      fetchPath: this.props.path,
      title: capitalize(this.props.title),
      subtitle: this.props.description
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <ParallaxPhoto
          id={this.props.id}
          source={{ uri: this.props.imageUri }}
          constrainWidth={Sizes.Width}
          startFrom={this.props.id > 1 ? Sizes.Height / 8 : -Sizes.Height / 8}/>
      </TouchableOpacity>
    );
  }
}