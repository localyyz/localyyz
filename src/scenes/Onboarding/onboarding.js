import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { observer, inject } from "mobx-react/native";
import Swiper from "react-native-swiper";
import {
  HeaderBackButton,
  StackActions,
  NavigationActions
} from "react-navigation";
import * as Animatable from "react-native-animatable";

import { Colours, Sizes, Styles } from "~/src/constants";
import Answer from "./components/answer";
import ActionButton from "./components/actionButton";
import PulseOverlay from "./components/pulseOverlay";

// there is an issue with safe area view with react navigation modal
// and for some reason adding top level padding breaks swiper (probably because
// it relies on onLayout to do some state calculation)
const SlidePaddingTop = Sizes.ScreenTop + Sizes.OuterFrame * 3;

class Header extends React.Component {
  render() {
    const { context, index, total } = this.props;

    const pageWidth = (Sizes.Width - 10) / context.props.children.length;
    const pageStyle = {
      backgroundColor: Colours.Background,
      height: 10,
      width: pageWidth
    };
    const activeStyle = { backgroundColor: Colours.Accented };

    let pages = [];
    const Page = <View style={pageStyle} />;
    const ActivePage = <View style={[pageStyle, activeStyle]} />;

    for (let i = 0; i < context.state.total; i++) {
      pages.push(
        i <= context.state.index
          ? React.cloneElement(ActivePage, { key: i })
          : React.cloneElement(Page, { key: i })
      );
    }

    const containerStyle = {
      position: "absolute",
      top: Sizes.ScreenTop,
      left: 0,
      right: 0,
      height: Sizes.OuterFrame * 2 + 10,
      paddingBottom: 10,
      paddingHorizontal: 10
    };

    const paginationStyle = {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    };

    const onBack = index == 0 ? this.props.onExit : this.props.onBack;
    const title = index == 0 ? "Quit" : "Back";

    return (
      <View style={containerStyle}>
        <HeaderBackButton
          title={title}
          onPress={onBack}
          tintColor={Colours.Tint}/>
        <View pointerEvents="none" style={paginationStyle}>
          {pages}
        </View>
      </View>
    );
  }
}

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
    const slides = this.store.questions
      .slice()
      .map((item, index) => (
        <Answer
          key={`slide${item.id}`}
          store={this.store}
          question={item}
          slideStyle={{ paddingTop: SlidePaddingTop }}
          active={
            this.store.slideIndex === index + 1 /* plus 1 for intro slide */
          }/>
      ));
    const children = [this.renderIntro(), ...slides];

    return (
      <View style={styles.container}>
        <Swiper
          ref={ref => (this._swiper = ref)}
          autoplay={false}
          loop={false}
          scrollEnabled={false}
          style={styles.list}
          renderPagination={this.renderPagination}>
          {children}
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
