import React from "react";
import { StatusBar, StyleSheet, View, Text } from "react-native";

// third party
import { withNavigation } from "react-navigation";

import { Styles, Sizes, Colours } from "localyyz/constants";

export class Modal extends React.Component {
  render() {
    // modal receives component to render via navigation props
    const { state: { params: { component } } } = this.props.navigation;
    const Component = React.cloneElement(component, {
      onClose: () => {
        this.props.navigation.goBack();
      }
    });

    return (
      <View style={styles.container}>
        <StatusBar hidden />
        {Component}
      </View>
    );
  }
}

export default withNavigation(Modal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Background
  }
});
