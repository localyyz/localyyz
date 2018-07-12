import React from "react";
import { StyleSheet, View, Text } from "react-native";

// third party
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";

export default class ExpandableHeader extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={this.props.enabled ? styles.label : styles.disabled} children={this.props.children} />
        {!this.props.hideCollapse || !this.props.isOpen ? (
          <MaterialIcon
            name={
              this.props.isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"
            }
            size={Sizes.Text}
            color={Colours.Text}/>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    alignItems: "center"
  },

  label: {
    marginRight: Sizes.InnerFrame / 2
  },

  disabled: {
    color: Colours.SubduedText,
    marginRight: Sizes.InnerFrame / 2
  }
});
