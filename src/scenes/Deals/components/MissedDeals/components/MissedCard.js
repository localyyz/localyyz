import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import { inject } from "mobx-react/native";
import Moment from "moment";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ConstrainedAspectImage } from "localyyz/components";
import { toPriceString } from "localyyz/helpers";

// constants
const CARD_WIDTH = Sizes.Width / 2;
const CARD_HEIGHT = CARD_WIDTH * 0.8;

@inject(stores => ({
  now: stores.dealStore.now
}))
export default class MissedCard extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  get container() {
    return this.props.deal.productPhoto ? ConstrainedAspectImage : View;
  }

  get title() {
    return Moment(this.props.deal.startAt).calendar(this.props.now, {
      sameDay: "[Today]",
      lastDay: "[Yesterday]",
      lastWeek: "[Last] dddd",
      nextDay: "[Tomorrow]",
      nextWeek: "dddd",
      sameElse: "DD/MM/YYYY"
    });
  }

  onPress() {
    this.props.deal
      && this.props.navigation.push("MissedDeal", {
        deal: this.props.deal
      });
  }

  render() {
    let product = this.props.deal.representativeProduct;
    let photo = this.props.deal.productPhoto;

    return (
      <TouchableOpacity onPress={this.onPress} style={styles.container}>
        <this.container
          source={photo && { uri: photo.imageUrl }}
          sourceWidth={photo.width}
          sourceHeight={photo.height}
          constrainHeight={CARD_HEIGHT}
          style={styles.card}/>
        <View style={styles.details}>
          <Text style={styles.title}>{this.title}</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>{`${Math.round(
              this.props.deal.percentageClaimed * 100
            )}% claimed`}</Text>
            <Text style={[styles.stat, Styles.Emphasized]}>
              Originally{" "}
              {toPriceString(
                this.props.deal.msrp,
                product.place && product.place.currency
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: Sizes.InnerFrame / 2,
    marginRight: Sizes.InnerFrame / 4,
    backgroundColor: Colours.Foreground
  },

  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT
  },

  details: {
    padding: Sizes.InnerFrame / 2,
    paddingTop: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  stats: {
    paddingTop: Sizes.InnerFrame / 2
  },

  stat: {
    ...Styles.Text,
    ...Styles.TinyText,
    marginTop: Sizes.InnerFrame / 8
  }
});
