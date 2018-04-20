import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Sizes, Colours, Styles } from "localyyz/constants";

// custom
import PickerFieldModal from "./modal";

export default class PickerField extends React.Component {
  static Modal = PickerFieldModal;

  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
        <View style={styles.underline}>
          <Text style={styles.input}>{this.props.label}</Text>
          <Text style={styles.selected}>
            {this.props.selectedValue
              ? this.props.options[this.props.selectedValue].label
              : "Not selected"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Sizes.InnerFrame / 4,
    paddingBottom: Sizes.OuterFrame / 2
  },

  underline: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingVertical: Sizes.InnerFrame / 3,
    borderBottomColor: Colours.SubduedText,
    borderBottomWidth: 1 / 2
  },

  input: {
    ...Styles.Text,
    ...Styles.Subdued,
    flex: 1
  },

  selected: {
    ...Styles.Text,
    paddingRight: Sizes.InnerFrame / 2
  }
});
