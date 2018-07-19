import React from "react";
import { View, StyleSheet, Text, Animated, Easing } from "react-native";

// third party
import Moment from "moment";
import LinearGradient from "react-native-linear-gradient";

// custom
import { BaseScene, ProgressBar, ProductList } from "localyyz/components";
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";

export default class MissedDealScene extends React.Component {
  constructor(props) {
    super(props);

    // data
    this.settings = this.props.navigation.state.params || {};
    this.claimed = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.claimed, {
      toValue: this.settings.deal.percentageClaimed,
      delay: 500,
      duration: 1000,
      easing: Easing.out(Easing.ease)
    }).start();
  }

  get title() {
    return `Ended ${Moment(this.settings.deal.endAt).calendar(Moment(), {
      sameDay: "[earlier today]",
      lastDay: "[yesterday]",
      lastWeek: "[last] dddd",
      nextDay: "[tomorrow]",
      nextWeek: "dddd",
      sameElse: "[on] DD/MM/YYYY"
    })}`;
  }

  render() {
    return (
      <View style={styles.container}>
        <BaseScene
          title={this.settings.deal.name}
          description={this.settings.deal.description}
          image={{
            imageUrl: this.settings.deal.imageUrl,
            width: this.settings.deal.imageWidth,
            height: this.settings.deal.imageHeight
          }}
          titleColor={Colours.AlternateText}
          backgroundColor={Colours.MenuBackground}
          transparentBackgroundColor={Colours.BlackTransparent}
          backColor={Colours.AlternateText}
          backAction={this.props.navigation.goBack}
          idleStatusBarStatus="light-content">
          <ProductList
            products={
              this.settings.deal.products && this.settings.deal.products.slice()
            }
            style={styles.content}/>
        </BaseScene>
        <View style={styles.footer} pointerEvents="none">
          <LinearGradient
            colors={[Colours.MenuBackground, Colours.BlackTransparent]}
            start={{ y: 1, x: 0 }}
            end={{ y: 0, x: 0 }}
            style={styles.stats}>
            <Text style={styles.date}>{this.title}</Text>
          </LinearGradient>
          <ProgressBar
            padding={Sizes.InnerFrame}
            progress={this.claimed}
            percentage={this.settings.deal.percentageClaimed}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: NAVBAR_HEIGHT,
    backgroundColor: Colours.MenuBackground
  },

  stats: {
    paddingHorizontal: Sizes.InnerFrame,
    paddingTop: Sizes.OuterFrame * 2,
    paddingBottom: Sizes.InnerFrame / 2
  },

  date: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  content: {},

  footer: {
    ...Styles.Overlay,
    justifyContent: "flex-end"
  }
});
