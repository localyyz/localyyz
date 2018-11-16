import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { observer, Provider } from "mobx-react/native";
import Swiper from "react-native-swiper";
import { StackActions, NavigationActions } from "react-navigation";

import { GA } from "~/src/global";
import { Sizes, Styles, Colours } from "~/src/constants";

// slides
import Outro from "./slides/outro";
import Question from "./slides/question";
import Store from "./store";

@observer
export default class PersonalizeScene extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }

  onMomentumScrollEnd = (_, state) => {
    // check if the previous question needed an answer
    const isNext = state.index > this.store.slideIndex;

    if (isNext) {
      // if we are going to the next slide + is asking questions
      // check if they've answered the previous question
      const prv = this.store.questions[this.store.slideIndex];
      if (!(prv.id in this.store.selectedToParams)) {
        this._swiper && this._swiper.scrollBy(-1, true);
        return;
      }
    }

    this.store.slideIndex = state.index;
    let slide = this.store.questions[state.index];
    if (slide.fetchPath) {
      this.store.fetchStyles(slide.fetchPath);
    }
    GA.trackScreen(`onboarding-${slide.id}`);
    GA.trackEvent("personalize", "start", slide.id, 0);
  };

  onFinish = () => {
    this.store.saveSelectedOptions().then(resolved => {
      if (resolved.success) {
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 1,
            key: null,
            actions: [
              NavigationActions.navigate({
                routeName: "App"
              }),
              NavigationActions.navigate({
                routeName: "App",
                action: NavigationActions.navigate({
                  routeName: "Home"
                })
              })
            ]
          })
        );
      }
    });
  };

  render() {
    const slides = this.store.questions.map(item => {
      const key = `slide${item.id}`;
      switch (item.id) {
        case "outro":
          return <Outro key={key} {...item} />;
        case "style":
          return <Question {...item} data={this.store.styles} key={key} />;
        default:
          return <Question {...item} key={key} />;
      }
    });

    return (
      <Provider onboardingStore={this.store}>
        <View style={styles.container}>
          <Swiper
            ref={ref => (this._swiper = ref)}
            autoplay={false}
            loop={false}
            showsPagination={true}
            scrollEventThrottle={16}
            onMomentumScrollEnd={this.onMomentumScrollEnd}>
            {slides}
          </Swiper>
          <View style={styles.button}>
            <View style={styles.inner}>
              {this.store.slideIndex === this.store.questions.length - 1
              && this.store.canFinish ? (
                <TouchableOpacity onPress={this.onFinish}>
                  <View style={styles.actionButton}>
                    <Text style={Styles.RoundedButtonText}>Finish</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  button: {
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
  }
});
