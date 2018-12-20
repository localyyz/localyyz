import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { observer, inject } from "mobx-react/native";
import { StackActions, NavigationActions } from "react-navigation";
import Swiper from "react-native-swiper";

import { Styles, Sizes, Colours } from "~/src/constants";
import { GA } from "~/src/global";

// slides
import Slide from "./slides/slide";

const onboard = [
  {
    id: "save",
    line1: "Welcome to Localyyz",
    line2: "Save up to 80% on designer fashion.",
    line3:
      "We keep you in the know via push notifications on thousands of sale items.",
    imageSrc: "",
    iconSrc: "price-tag",
    backgroundColor: Colours.SkyBlue,
    skippable: true
  },
  {
    id: "discount",
    line1: "Discover offers with ease.",
    line2: "Updated daily from hundreds of stores.",
    line3:
      "Tired of waiting for a discount code? Easily browse hundreds all in one place.",
    imageSrc: "",
    iconSrc: "wallet",
    backgroundColor: Colours.RoseRed,
    skippable: true
  },
  {
    id: "discover",
    line1: "Shop top brands and styles.",
    line2: "From 100s of stores around the world.",
    line3:
      "Discover hand curated brands from New York, Los Angeles, Paris and London all in one app.",
    imageSrc: "",
    iconSrc: "globe",
    backgroundColor: Colours.UltraViolet,
    skippable: true
  },
  {
    id: "personalize",
    line1: "We are your personal shopper.",
    line2: "Discover the perfect look tailored just for you.",
    line3:
      "We know everyone is different, that's why use the power of machine learning to learn and adapt Localyyz to your unique style.",
    iconSrc: "user",
    backgroundColor: Colours.FloridaOrange,
    skippable: true
  },
  {
    id: "questions",
    line1: "Ready to go?",
    line2: "Complete the style quiz.",
    line3:
      "Answer a few questions to help us personalize the home feed for you.",
    iconSrc: "question-answer",
    iconTyle: "MaterialIcons",
    backgroundColor: Colours.GrassRootGreen,
    skippable: true
  }
];

@inject(stores => ({
  userStore: stores.userStore
}))
@observer
export default class OnboardingScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    };
  }

  componentDidMount() {
    this.props.userStore.markOnboarded();
  }

  onMomentumScrollEnd = (_, state) => {
    this.setState({ slideIndex: state.index });
    let name = onboard[state.index].id;
    GA.trackScreen(`onboarding-${name}`);
    GA.trackEvent("personalize", "start", name, 0);
  };

  onExit = () => {
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
  };

  onFinish = () => {
    this.props.navigation.navigate("Personalize");
  };

  render() {
    const slides = onboard.map(item => {
      return <Slide key={`slide${item.id}`} {...item} />;
    });

    return (
      <View style={styles.container}>
        <Swiper
          autoplay={true}
          loop={false}
          showsPagination={true}
          activeDotColor={Colours.Foreground}
          scrollEventThrottle={16}
          autoplayTimeout={3.5}
          onMomentumScrollEnd={this.onMomentumScrollEnd}>
          {slides}
        </Swiper>
        <View style={styles.buttonContainer}>
          <View style={styles.inner}>
            {this.state.slideIndex === 0 ? (
              <TouchableOpacity onPress={this.onExit}>
                <Text style={styles.exit}>
                  Can't wait to start exploring? Skip for now.
                </Text>
              </TouchableOpacity>
            ) : this.state.slideIndex === onboard.length - 1 ? (
              <TouchableOpacity onPress={this.onFinish}>
                <View style={styles.actionButton}>
                  <Text style={Styles.RoundedButtonText}>Start the quiz</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },
  buttonContainer: {
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

  exit: {
    ...Styles.SmallText,
    ...Styles.Subtitle,
    textAlign: "center",
    paddingTop: Sizes.InnerFrame / 2,
    color: Colours.Foreground
  }
});
