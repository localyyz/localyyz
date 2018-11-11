import React from "react";
import { StyleSheet, View } from "react-native";

import Carousel from "react-native-snap-carousel";
import { inject, observer } from "mobx-react/native";

import { Colours, Sizes } from "localyyz/constants";
import DealCard, { CardHeight } from "./DealCard";

function wp(percentage) {
  const value = percentage * Sizes.Width / 100;
  return Math.round(value);
}

const slideWidth = wp(90);
const itemHorizontalMargin = wp(2);
const itemWidth = slideWidth + itemHorizontalMargin * 2;

@inject(stores => ({
  deals: stores.dealStore.featuredDeals.slice()
}))
@observer
export default class FeaturedDeals extends React.Component {
  renderItem = ({ item: deal }) => {
    return (
      <View
        style={{
          width: itemWidth,
          height: CardHeight + 18,
          paddingHorizontal: itemHorizontalMargin,
          paddingBottom: 18 // needed for shadow
        }}>
        <View style={styles.shadow} />
        <DealCard {...deal} cardWidth={itemWidth} />
      </View>
    );
  };

  render() {
    return (
      <Carousel
        data={this.props.deals}
        layout={"stack"}
        layoutCardOffset={18}
        renderItem={this.renderItem}
        sliderWidth={Sizes.Width}
        itemWidth={itemWidth}
        contentContainerCustomStyle={{
          paddingVertical: 10
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  shadow: {
    position: "absolute",
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    backgroundColor: Colours.Foreground,
    borderRadius: Sizes.InnerFrame / 2
  }
});
