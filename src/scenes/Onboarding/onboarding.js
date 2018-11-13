import React from "react";
import { View, StyleSheet } from "react-native";
import { observer, inject } from "mobx-react/native";
import Swiper from "react-native-swiper";
import { StackActions, NavigationActions } from "react-navigation";

import { Colours } from "~/src/constants";
import ActionButton from "./components/actionButton";
import PulseOverlay from "./components/pulseOverlay";

// slides
import Outro from "./slides/outro";
import Slide from "./slides/slide";
import Question from "./slides/question";

@inject(stores => ({
  onboardingStore: stores.onboardingStore
}))
@observer
export default class OnboardingScene extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.onboardingStore;

    this.state = {
      processingSubtitle: "",
      isProcessing: false
    };
  }

  onNext = () => {
    this.store.addToSlideIndex(1);
    this.scrollBy(1);
  };

  onMomentumScrollEnd = (_, state) => {
    // check if the previous question needed an answer
    const prvIndex = this.store.slideIndex;
    const isNext = state.index > prvIndex;
    const prvSlide = this.store.questions[prvIndex];

    if (isNext && !prvSlide.skippable) {
      if (!(prvSlide.id in this.store.selectedToParams)) {
        this.scrollBy(-1);
        return;
      }
    }
    this.store.addToSlideIndex(state.index - prvIndex);
  };

  scrollBy = i => {
    this._swiper && this._swiper.scrollBy(i, true);
  };

  onSkipToQuestions = () => {
    this._swiper && this._swiper.scrollBy(this.store.skipToQuestionN, false);
  };

  onFinish = () => {
    this.setState({
      isProcessing: true,
      processingSubtitle: "Putting together your feed..."
    });

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
        case "discount":
        case "save":
        case "discover":
        case "personalize":
          return <Slide key={key} {...item} />;
        case "outro":
          return <Outro key={key} {...item} />;
        default:
          return <Question {...item} key={key} store={this.store} />;
      }
    });

    return (
      <View style={styles.container}>
        <Swiper
          ref={ref => (this._swiper = ref)}
          autoplay={false}
          loop={false}
          showsPagination={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd}>
          {slides}
        </Swiper>
        <ActionButton
          onSkip={this.onSkipToQuestions}
          onNext={this.onNext}
          onFinish={this.onFinish}
          onExit={() => this.props.navigation.goBack(null)}/>
        <PulseOverlay
          subtitle={this.state.processingSubtitle}
          isProcessing={this.state.isProcessing}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  }
});
