import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

// third party
import { withNavigation } from "react-navigation";
import EntypoIcon from "react-native-vector-icons/Entypo";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";

@withNavigation
export default class MoreFooter extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  get numProducts() {
    return this.props.numProducts > 1000 ? "1000+" : this.props.numProducts;
  }

  onPress() {
    this.props.navigation.navigate("ProductList", {
      fetchPath: this.props.fetchPath,
      title: capitalize(this.props.title),
      description: this.props.description,
      image: this.props.imageUrl && {
        imageUrl: this.props.imageUrl,
        width: this.props.imageWidth,
        height: this.props.imageHeight
      },
      categories: this.props.categories,
      basePath: this.props.basePath
    });
  }

  render() {
    return this.props.numProducts && this.props.numProducts > 0 ? (
      <TouchableOpacity onPress={this.props.onPress || this.onPress}>
        <View style={styles.container}>
          <View style={styles.button}>
            <EntypoIcon
              name="chevron-small-down"
              color={Colours.Text}
              size={Sizes.SmallText}/>
            <Text style={styles.label}>{`expand to see ${
              this.numProducts
            } more`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.InnerFrame / 2
  },

  button: {
    ...Styles.Horizontal,
    alignItems: "center",
    justifyContent: "center"
  },

  label: {
    ...Styles.Text,
    ...Styles.SmallText,
    marginLeft: Sizes.InnerFrame / 2,
    paddingBottom: Sizes.SmallText / 4
  }
});
