import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// third party
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { SloppyView } from "localyyz/components";
import { capitalize } from "localyyz/helpers";

export default class SelectedFilter extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{capitalize(this.props.children)}</Text>
        <TouchableOpacity onPress={this.props.onClear} style={styles.clear}>
          <SloppyView>
            <MaterialIcon
              name="close"
              size={Sizes.TinyText}
              color={Colours.AlternateText}/>
          </SloppyView>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Sizes.InnerFrame / 2,
    paddingVertical: Sizes.InnerFrame / 4,
    borderRadius: Sizes.OuterFrame,
    backgroundColor: Colours.MenuBackground
  },

  label: {
    ...Styles.Text,
    ...Styles.TinyText,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  clear: {
    marginLeft: Sizes.InnerFrame / 4
  }
});
