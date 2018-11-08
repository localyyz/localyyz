import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { observer, inject } from "mobx-react/native";
import Swiper from "react-native-swiper";
import { StackActions, NavigationActions } from "react-navigation";
import * as Animatable from "react-native-animatable";

import { Colours, Sizes, Styles } from "~/src/constants";
import Answer from "./components/answer";
import ActionButton from "./components/actionButton";
import PulseOverlay from "./components/pulseOverlay";
import Header from "./components/header";
import Outro from "./components/outro";

// there is an issue with safe area view with react navigation modal
// and for some reason adding top level padding breaks swiper (probably because
// it relies on onLayout to do some state calculation)
const SlidePaddingTop = Sizes.ScreenTop + Sizes.OuterFrame * 3;

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

  renderIntro = () => {
    return (
      <View key="intro" style={styles.intro}>
        <Text style={styles.h1}>Welcome to Localyyz!</Text>
        <Text style={styles.subtitle}>
          Answer the questions on the next few screens to help us know you
          better.
        </Text>
        <View style={{ padding: Sizes.InnerFrame }}>
          <Animatable.Image
            animation={
              this.props.onboardingStore.slideIndex === 0 ? "zoomIn" : ""
            }
            source={{ uri: "person_foreground" }}
            style={{
              width: Sizes.Width - 2 * Sizes.OuterFrame,
              height: Sizes.Width - 2 * Sizes.OuterFrame
            }}/>
        </View>
      </View>
    );
  };

  scrollBy = i => {
    this._swiper && this._swiper.scrollBy(i, true);
  };

  onBack = () => {
    this.store.addToSlideIndex(-1);
    this.scrollBy(-1);
  };

  onNext = () => {
    this.store.addToSlideIndex(1);
    this.scrollBy(1);
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

  renderPagination = (index, total, context) => {
    return (
      <Header
        index={index}
        total={total}
        context={context}
        onBack={this.onBack}
        onExit={() => this.props.navigation.goBack(null)}/>
    );
  };

  render() {
    const slides = this.store.questions.map((item, index) => {
      switch (item.id) {
        case "intro":
          return this.renderIntro();
        case "outro":
          return <Outro key="outro" />;
        default:
          return (
            <Answer
              key={`slide${item.id}`}
              store={this.store}
              question={item}
              slideStyle={{ paddingTop: SlidePaddingTop }}
              active={this.store.slideIndex === index}/>
          );
      }
    });

    return (
      <View style={styles.container}>
        <Swiper
          ref={ref => (this._swiper = ref)}
          autoplay={false}
          loop={false}
          scrollEnabled={false}
          renderPagination={this.renderPagination}>
          {slides}
        </Swiper>
        <ActionButton onNext={this.onNext} onFinish={this.onFinish} />
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
  },

  intro: {
    paddingTop: SlidePaddingTop,
    paddingBottom: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame,
    justifyContent: "center",
    alignItems: "center",
    minHeight: Sizes.InnerFrame * 3,
    backgroundColor: Colours.Transparent
  },

  h1: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    ...Styles.Title,
    paddingBottom: Sizes.InnerFrame
  },

  subtitle: {
    ...Styles.Text
  }
});
