import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { inject, observer } from "mobx-react/native";

import { Colours, Sizes, Styles } from "~/src/constants";

@inject(stores => ({
  store: stores.onboardingStore
}))
@observer
export default class ActionButton extends React.Component {
  render() {
    const index = this.props.store.slideIndex;
    const shouldFinish = index === this.props.store.questions.length - 1;

    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          {shouldFinish && this.props.store.canFinish ? (
            <TouchableOpacity onPress={this.props.onFinish}>
              <View style={styles.actionButton}>
                <Text style={Styles.RoundedButtonText}>Finish</Text>
              </View>
            </TouchableOpacity>
          ) : null}

          {index === 0 ? (
            <TouchableOpacity onPress={this.props.onExit}>
              <Text style={styles.skip}>
                Can't wait to start exploring? Skip for now.
              </Text>
            </TouchableOpacity>
          ) : this.props.store.slideSkippable ? (
            <TouchableOpacity onPress={this.props.onSkip}>
              <Text style={styles.skip}>Skip to the questions.</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: Sizes.Height / 8,
    marginHorizontal: Sizes.OuterFrame,
    justifyContent: "center"
  },

  inner: {
    flex: 1
  },

  actionButton: {
    ...Styles.RoundedButton,
    width: Sizes.Width - 2 * Sizes.OuterFrame,
    alignItems: "center",
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  },

  skip: {
    ...Styles.SmallText,
    ...Styles.Subtitle,
    textAlign: "center",
    paddingTop: Sizes.InnerFrame / 2,
    color: Colours.Foreground
  }
});
