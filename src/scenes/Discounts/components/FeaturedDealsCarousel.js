import React from "react";
import { View, StyleSheet, Text } from "react-native";

import Carousel from "react-native-snap-carousel";

import { inject } from "mobx-react/native";

import { Colours, Sizes, Styles } from "localyyz/constants";

import DealCard from "./DealCard";

const SLIDER_1_FIRST_ITEM = 1;

@inject(stores => ({
  fetch: stores.dealStore.fetchFeaturedDeals,
  featuredDeals: stores.dealStore.featuredDeals
    ? stores.dealStore.featuredDeals.slice()
    : []
}))
export default class FeaturedDealsCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM
    };
  }

  componentDidMount() {
    this.props.fetch();
  }

  renderFeaturedItem = ({ item: deal }) => {
    return <DealCard {...deal} />;
  };

  render() {
    return (
      <View styles={styles.carouselContainer}>
        {this.props.featuredDeals.length !== 0 ? (
          <Text style={styles.title}>{"Featured Deals"}</Text>
        ) : null}
        <Carousel
          ref={c => (this.sliderRef = c)}
          data={this.props.featuredDeals}
          renderItem={this.renderFeaturedItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          onSnapToItem={index => this.setState({ slider1ActiveSlide: index })}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          autoplay={true}
          autoplayDelay={800}
          autoplayInterval={4000}/>
      </View>
    );
  }
}

const slideWidth = 3 * Sizes.Width / 4;
const slideHeight = 2 * Sizes.Height / 5;
const itemHorizontalMargin = Sizes.Width / 50;

export const sliderWidth = Sizes.Width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const styles = StyleSheet.create({
  slider: {},

  sliderContentContainer: {
    marginBottom: Sizes.OuterFrame
  },

  carouselContainer: {
    flex: 1
  },

  title: {
    paddingHorizontal: 30,
    paddingBottom: 8,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  }
});
