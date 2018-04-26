import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

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
          constrainWidth={Sizes.Width}>
          <View style={styles.container}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subtitle}>{this.props.description}</Text>
          </View>
        </ParallaxPhoto>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    padding: Sizes.OuterFrame,
    marginLeft: Sizes.Width / 3,
    backgroundColor: Colours.Foreground
  },

  title: {
    ...Styles.Text,
    ...Styles.Title
  },

  subtitle: {
    ...Styles.Text,
    ...Styles.Subtitle,
    marginTop: Sizes.InnerFrame / 2
  }
});
