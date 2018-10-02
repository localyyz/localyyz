import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet
} from "react-native";
import { observer, inject } from "mobx-react/native";
import Swiper from "react-native-swiper";

import { Colours, Sizes, Styles } from "~/src/constants";
import Button from "./components/button";

@observer
class Topic extends React.Component {
  render() {
    return (
      <View>
        <Button {...this.props.item} onPress={this.props.onPress} />
        <Text style={[Styles.Text, { paddingHorizontal: Sizes.OuterFrame }]}>
          {this.props.item.desc}
        </Text>
      </View>
    );
  }
}

class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _currIndex: 0
    };
  }

  onNext = () => {
    this.props.onNext && this.props.onNext();
    const newIndex = (this.state._currIndex += 1);
    this.setState({ _currIndex: newIndex });
  };

  onFinish = () => {
    this.props.onFinish && this.props.onFinish();
  };

  onBack = () => {
    this.props.onBack && this.props.onBack();
    this._swiper && this._swiper.scrollBy(-1, true);
    const newIndex = (this.state._currIndex -= 1);
    this.setState({ _currIndex: newIndex });
  };

  onExit = () => {
    this.props.onExit && this.props.onExit();
  };

  render() {
    const onNext
      = this.state._currIndex < this.props.maxIndex ? this.onNext : this.onFinish;
    const onBack = this.state._currIndex == 0 ? this.onExit : this.onBack;

    return (
      <View
        pointerEvents="box-none"
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: Sizes.Width
        }}>
        <TouchableWithoutFeedback onPress={onBack}>
          <View
            style={{
              width: Sizes.Width / 4,
              backgroundColor: Colours.SubduedForeground,
              alignItems: "center",
              paddingVertical: Sizes.InnerFrame
            }}>
            <Text style={Styles.RoundedButtonText}>
              {this.state._currIndex == 0 ? "Exit" : "Back"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onNext}>
          <View
            style={{
              width: 3 * Sizes.Width / 4,
              backgroundColor: Colours.PositiveButton,
              alignItems: "center",
              paddingVertical: Sizes.InnerFrame
            }}>
            <Text style={Styles.RoundedButtonText}>
              {this.state._currIndex < this.props.maxIndex ? "Next" : "Finish"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

@inject(stores => ({
  onboardingStore: stores.onboardingStore
}))
@observer
export default class Questions extends React.Component {
  sections = [
    {
      id: 1,
      value: "segment",
      label: "Q1. What kind of shopper are you?",
      data: [
        {
          id: 21,
          value: "smart",
          label: "Smart Shopper",
          desc:
            "You're a smart shopper. You usually spend less than $50 on most of your purchases.",
          data: []
        },
        {
          id: 22,
          value: "boutique",
          label: "Boutique Finder",
          desc:
            "You like to showcase your sense of style, and not afraid to spend a little more. Usually your purchases are between $50-$200.",
          data: []
        },
        {
          id: 23,
          value: "luxury",
          label: "Luxury Lover",
          desc:
            "You love everything luxury and big name brands. Usually you spend more than $200.",
          data: []
        }
      ]
    },
    {
      id: 2,
      value: "category",
      label: "Q2: Which category would you like to see more of?",
      data: [
        {
          id: 20000,
          value: "woman",
          label: "Woman's Fashion",
          data: []
        },
        {
          id: 10000,
          value: "man",
          label: "Men's Fashion",
          data: []
        }
      ]
    },
    {
      id: 3,
      value: "meta",
      label: "Q3: Are you also interested...",
      data: [
        {
          id: 30000,
          value: "newin",
          label: "Newest Products",
          desc: "Always show me the newest products first.",
          data: []
        },
        {
          id: 40000,
          value: "trend",
          label: "Trending Products",
          desc: "Always show me what's most trending first.",
          data: []
        },
        {
          id: 50000,
          value: "bestsell",
          label: "Best Selling",
          desc: "Show me what's selling the best first.",
          data: []
        },
        {
          id: 60000,
          value: "bestdeal",
          label: "Best Deals",
          desc: "Show me the best deals first.",
          data: []
        }
      ]
    }
  ];

  constructor(props) {
    super(props);
    this.store = props.onboardingStore;
  }

  renderIntro = () => {
    return (
      <View key="intro" style={styles.header}>
        <Text style={styles.h1}>The Style Quiz</Text>
        <Text style={styles.subtitle}>
          Answer the questions on the next few screens to help us know you
          better.
        </Text>
      </View>
    );
  };

  renderSlide = item => {
    return (
      <ScrollView key={`slide${item.id}`} contentContainerStyle={styles.slide}>
        <Text key={`label${item.id}`} style={styles.sectionTitle}>
          {item.label}
        </Text>
        {item.data.slice().map(d => {
          return (
            <View
              key={`topic${d.id}`}
              style={{ paddingBottom: Sizes.OuterFrame }}>
              <Topic item={d} onPress={() => this.store.selectOption(d)} />
            </View>
          );
        })}
      </ScrollView>
    );
  };

  onFinish = () => {
    this.store.storeUserCategory();
    this.props.navigation.navigate("PickMerchant");
  };

  render() {
    const slides = this.sections.slice().map(item => this.renderSlide(item));
    const children = [this.renderIntro(), ...slides];
    const scrollBy = i => this._swiper && this._swiper.scrollBy(i, true);

    return (
      <View style={styles.container}>
        <Swiper
          ref={ref => (this._swiper = ref)}
          autoplay={false}
          loop={false}
          scrollEnabled={false}
          style={styles.list}
          paginationStyle={{ bottom: undefined, top: 25 }}>
          {children}
        </Swiper>
        <ActionButton
          maxIndex={this.sections.length}
          onExit={() => this.props.navigation.goBack(null)}
          onFinish={() => this.onFinish()}
          onNext={() => scrollBy(1)}
          onBack={() => scrollBy(-1)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Sizes.ScreenTop,
    backgroundColor: Colours.Foreground
  },

  slide: {
    paddingHorizontal: Sizes.OuterFrame,
    paddingBottom: Sizes.ScreenBottom + Sizes.Height / 5
  },

  header: {
    paddingTop: Sizes.OuterFrame * 2,
    paddingBottom: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame,
    minHeight: Sizes.InnerFrame * 3
  },

  sectionTitle: {
    fontSize: Sizes.H2,
    fontWeight: Sizes.Heavy,
    paddingTop: Sizes.OuterFrame * 2,
    paddingBottom: Sizes.InnerFrame,
    paddingRight: Sizes.OuterFrame
  },

  h1: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    ...Styles.Title,
    paddingBottom: Sizes.InnerFrame
  },

  subtitle: {
    ...Styles.Text
  },

  footer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: Sizes.ScreenBottom + Sizes.OuterFrame,
    alignItems: "center",
    justifyContent: "flex-end"
  }
});
