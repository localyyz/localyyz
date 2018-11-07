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
    const shouldFinish
      = this.props.store.slideIndex === this.props.store.questions.length - 1;
    const onNext = shouldFinish ? this.props.onFinish : this.props.onNext;

    let hasCurrentAnswer;
    // edge case because first slide index is an intro
    if (this.props.store.slideIndex == 0 || shouldFinish) {
      hasCurrentAnswer = true;
    } else {
      //check if the (index)th question has been answered or not
      let key = this.props.store.questions[this.props.store.slideIndex].id;
      hasCurrentAnswer = key in this.props.store.selectedToParams;
    }

    return (
      <View
        style={{
          position: "absolute",
          bottom: Sizes.ScreenBottom ? Sizes.ScreenBottom : Sizes.InnerFrame,
          marginHorizontal: Sizes.OuterFrame
        }}>
        {!shouldFinish || (shouldFinish && this.props.store.canFinish) ? (
          <TouchableOpacity onPress={hasCurrentAnswer ? onNext : () => {}}>
            <View style={hasCurrentAnswer ? styles.actionButton : {}}>
              <Text
                style={[
                  Styles.RoundedButtonText,
                  hasCurrentAnswer ? {} : { color: Colours.Tint }
                ]}>
                {shouldFinish
                  ? "Finish"
                  : hasCurrentAnswer ? "Next" : "Please select your answer"}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionButton: {
    width: Sizes.Width - 2 * Sizes.OuterFrame,
    borderRadius: Sizes.OuterFrame / 2,
    backgroundColor: Colours.PositiveButton,
    alignItems: "center",
    paddingTop: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  }
});
