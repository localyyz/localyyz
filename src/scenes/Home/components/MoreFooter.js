import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

// third party
import { withNavigation } from "react-navigation";
import EntypoIcon from "react-native-vector-icons/Entypo";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";

export class MoreFooter extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.navigation.push("ProductList", {
      fetchPath: this.props.fetchFrom,
      title: capitalize(this.props.title),
      description: this.props.description,
      categories: this.props.categories,
      basePath: this.props.basePath
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress || this.onPress}>
        <View style={styles.container}>
          <View style={styles.button}>
            <EntypoIcon
              name="chevron-small-down"
              color={Colours.Text}
              size={Sizes.SmallText}/>
            <Text style={styles.label}>{"expand to see more"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(MoreFooter);

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
    fontSize: Sizes.H2,
    marginLeft: Sizes.InnerFrame / 2,
    paddingBottom: Sizes.SmallText / 4
  }
});
