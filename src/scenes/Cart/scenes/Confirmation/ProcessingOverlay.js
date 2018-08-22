import React from "react";
import { View, StyleSheet, Text } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import * as Animatable from "react-native-animatable";
import { observer, inject } from "mobx-react/native";

@inject(stores => ({
  isProcessing: stores.confirmationUiStore.isProcessing
}))
@observer
export default class ProcessingOverlay extends React.Component {
  render() {
    return this.props.isProcessing ? (
      <Animatable.View
        animation="fadeInUp"
        duration={300}
        delay={300}
        style={styles.container}>
        <View style={styles.text}>
          <Text style={styles.title}>Just a minute</Text>
          <Text style={styles.subtitle}>
            {"We're trying to process your payment right now"}
          </Text>
        </View>
        <Animatable.View
          animation="pulse"
          easing="ease-out"
          duration={200}
          iterationCount="infinite">
          <Text style={styles.icon}>💸</Text>
        </Animatable.View>
      </Animatable.View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Overlay,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.Primary
  },

  text: {
    marginHorizontal: Sizes.OuterFrame * 3
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Oversized,
    ...Styles.Alternate
  },

  subtitle: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Alternate,
    marginTop: Sizes.InnerFrame,
    marginBottom: Sizes.OuterFrame * 3
  },

  icon: {
    fontSize: Sizes.Oversized * 2
  }
});
