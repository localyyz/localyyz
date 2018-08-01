import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import Moment from "moment";
import { inject, observer } from "mobx-react/native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ConstrainedAspectImage } from "localyyz/components";
import UpcomingDealUIStore from "./store";

@inject(stores => ({
  dealStore: stores.dealStore
}))
@observer
export default class UpcomingCard extends React.Component {

  constructor(props){
    super(props);
    // so it starts pulling in the percentage claimed when the deal becomes active
    this.store = new UpcomingDealUIStore(this.props.deal);
  }

  render() {
    let cardWidth = Sizes.Width - Sizes.InnerFrame * 2;
    return this.props.deal ? (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("Product", {
            product: this.product,
            // used for now timer sync
            dealStore: this.props.dealStore,
            // deal data itself
            activeDealStore: this.store
          })
        }>
        <View>
          {this.props.deal.imageUrl ? (
            <ConstrainedAspectImage
              constrainWidth={cardWidth}
              sourceWidth={this.props.deal.imageWidth || null}
              sourceHeight={this.props.deal.imageHeight || null}
              source={{ uri: this.props.deal.imageUrl }}/>
          ) : null}
          <View style={[styles.cardContainer, styles.card]}>
            <Text style={styles.title}>
              {this.dayDifference === 0 ? "Today" : this.dayDifference === 1 ? "Tomorrow"  : `In ${this.dayDifference} days`}
            </Text>
            <Text style={styles.text}>{this.props.deal.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : null;
  }

  get product() {
    return this.props.deal.products[0]
  }

  get dayDifference(){
    return Moment(this.props.deal.startAt).diff(this.props.now, "d")
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  card: {
    padding: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.Title,
    marginBottom: Sizes.InnerFrame / 2
  },

  text: {
    ...Styles.Text
  }
});
