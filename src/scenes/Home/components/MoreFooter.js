import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

// third party
import { withNavigation } from "react-navigation";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";

export class MoreFooter extends React.Component {
  onPress = () => {
    this.props.navigation.push("ProductList", {
      fetchPath: this.props.fetchFrom,
      title: capitalize(this.props.title),
      description: this.props.description,
      categories: this.props.categories,
      basePath: this.props.basePath
    });
  };

  render() {
    const count = this.props.count > 2000 ? "2000+" : this.props.count;

    return (
      <TouchableOpacity onPress={this.props.onPress || this.onPress}>
        <View style={styles.container}>
          <View style={styles.button}>
            <Text style={styles.label}>Show all ({count})</Text>
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
    borderWidth: 1,
    borderColor: Colours.PositiveButton,
    borderRadius: Sizes.RoundedBorders,
    paddingVertical: Sizes.InnerFrame / 2
  },

  button: {
    ...Styles.Horizontal,
    alignItems: "center",
    justifyContent: "center"
  },

  label: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    fontWeight: "bold",
    fontSize: Sizes.H2,
    color: Colours.PositiveButton
  }
});
