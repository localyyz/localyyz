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
    const onNext = shouldFinish ? this.props.onFinish : this.props.onNext;

    let isVisible;
    // if skippable or finish, we can activate
    if (this.props.store.slideSkippable || shouldFinish) {
      isVisible = true;
    } else {
      //check if the (index)th question has been answered or not
      let key = this.props.store.activeSlideKey;
      isVisible = key in this.props.store.selectedToParams;
    }

    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          {!shouldFinish || (shouldFinish && this.props.store.canFinish) ? (
            <TouchableOpacity onPress={isVisible ? onNext : () => {}}>
              <View style={isVisible ? styles.actionButton : {}}>
                <Text
                  style={[
                    Styles.RoundedButtonText,
                    isVisible ? {} : { color: Colours.Tint }
                  ]}>
                  {shouldFinish ? "Finish" : isVisible ? "Next" : null}
                </Text>
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
              <Text style={styles.skip}>Skip to questions.</Text>
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
    height: Sizes.Height / 6,
    marginHorizontal: Sizes.OuterFrame,
    justifyContent: "center"
  },

  inner: {
    flex: 1
  },

  actionButton: {
    width: Sizes.Width - 2 * Sizes.OuterFrame,
    borderRadius: Sizes.OuterFrame / 2,
    backgroundColor: Colours.PositiveButton,
    alignItems: "center",
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  },

  skip: {
    ...Styles.SmallText,
    ...Styles.Subtitle,
    textAlign: "center",
    paddingTop: Sizes.InnerFrame / 2
  }
});
