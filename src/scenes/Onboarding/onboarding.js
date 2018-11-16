import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Provider, observer, inject } from "mobx-react/native";
import { StackActions, NavigationActions } from "react-navigation";
import Swiper from "react-native-swiper";

import { Styles, Sizes, Colours } from "~/src/constants";
import { GA } from "~/src/global";

// slides
import Slide from "./slides/slide";
import Store from "./store";

@inject(stores => ({
  userStore: stores.userStore
}))
@observer
export default class OnboardingScene extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }

  componentDidMount() {
    this.props.userStore.markOnboarded();
  }

  onMomentumScrollEnd = (_, state) => {
    this.store.slideIndex = state.index;
    let name = this.store.onboard[state.index].id;
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
    const slides = this.store.onboard.map(item => {
      return <Slide key={`slide${item.id}`} {...item} />;
    });

    return (
      <Provider onboardingStore={this.store}>
        <View style={styles.container}>
          <Swiper
            autoplay={true}
            loop={false}
            showsPagination={true}
            activeDotColor={Colours.Foreground}
            scrollEventThrottle={16}
            onMomentumScrollEnd={this.onMomentumScrollEnd}>
            {slides}
          </Swiper>
          <View style={styles.buttonContainer}>
            <View style={styles.inner}>
              {this.store.slideIndex === 0 ? (
                <TouchableOpacity onPress={this.onExit}>
                  <Text style={styles.exit}>
                    Can't wait to start exploring? Skip for now.
                  </Text>
                </TouchableOpacity>
              ) : this.store.slideIndex === this.store.onboard.length - 1 ? (
                <TouchableOpacity onPress={this.onFinish}>
                  <View style={styles.actionButton}>
                    <Text style={Styles.RoundedButtonText}>Start the quiz</Text>
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
