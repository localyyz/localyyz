import React from "react";
import { View, StyleSheet, Text } from "react-native";

// custom
import { Styles, Colours } from "localyyz/constants";

export default class Error extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text numberOfLines={1} style={styles.label}>
          {this.props.children}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  label: {
    ...Styles.Text,
    ...Styles.SmallText,
    color: Colours.Fail
  }
});
