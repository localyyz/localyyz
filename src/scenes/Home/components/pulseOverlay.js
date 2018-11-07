import React from "react";
import { View, StyleSheet, Text } from "react-native";

// custom
import { Colours, Sizes, Styles } from "~/src/constants";

// third party
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";

export default class ProcessingOverlay extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string
  };

  static defaultProps = {
    title: "Just a minute...",
    subtitle: "We're putting together your feed."
  };

  render() {
    return this.props.isProcessing ? (
      <Animatable.View
        animation="fadeIn"
        duration={300}
        style={styles.container}>
        <Animatable.View
          animation="pulse"
          easing="ease-out"
          duration={200}
          iterationCount="infinite">
          <Text style={styles.icon}>💡</Text>
        </Animatable.View>
        <View style={styles.text}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.subtitle}>{this.props.subtitle}</Text>
        </View>
      </Animatable.View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Overlay,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.Accented
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
    ...Styles.Alternate,
    marginTop: Sizes.InnerFrame,
    marginBottom: Sizes.OuterFrame * 3,
    textAlign: "center"
  },

  icon: {
    paddingBottom: 30,
    fontSize: Sizes.Oversized * 2
  }
});
