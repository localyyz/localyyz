import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

// custom
import { Sizes, Colours } from "~/src/constants";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default class Modal extends React.Component {
  render() {
    // modal receives component to render via navigation props
    const { state: { params: { component, ...rest } } } = this.props.navigation;
    const Component = React.cloneElement(component, {
      ...rest,
      onClose: () => {
        this.props.navigation.goBack();
      }
    });

    return (
      <SafeAreaView style={styles.container}>
        {Component}
        <View style={styles.close}>
          <MaterialIcon.Button
            name="close"
            size={Sizes.ActionButton}
            underlayColor={Colours.Transparent}
            backgroundColor={Colours.Transparent}
            color={Colours.EmphasizedText}
            onPress={() => this.props.navigation.goBack()}/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  close: {
    position: "absolute",
    top: 5 + Sizes.ScreenTop,
    left: 5
  }
});
