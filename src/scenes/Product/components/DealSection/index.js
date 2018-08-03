import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import Moment from "moment";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { Timer, ProgressBar } from "localyyz/components";

@inject(stores => ({
  now: stores.dealStore && stores.dealStore.now,
  product: stores.productStore.product,
  progress: stores.activeDealStore && stores.activeDealStore.progress,
  deal: stores.activeDealStore && stores.activeDealStore.deal
}))
@observer
export default class DealSection extends React.Component {
  get isActive() {
    return Moment(this.props.deal.startAt).diff(this.props.now) < 0;
  }

  render() {
    return this.props.deal ? (
      <View style={styles.container}>
        {this.isActive ? (
          <ProgressBar
            padding={Sizes.InnerFrame}
            percentage={this.props.deal.percentageClaimed}
            progress={this.props.progress}/>
        ) : null}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {this.isActive ? "Today's deal" : "Upcoming deal"}
            </Text>
            <View style={styles.stats}>
              <Text style={[styles.title, styles.subTitle]}>
                <Text>{this.isActive ? "ending in " : "starting in "}</Text>
                {this.isActive ? (
                  this.props.deal.endAt ? (
                    <Timer
                      target={Moment(this.props.deal.endAt).toArray()}
                      onComplete={() =>
                        this.props.navigation && this.props.navigation.goBack()
                      }/>
                  ) : (
                    "soon"
                  )
                ) : this.props.deal.startAt ? (
                  <Timer target={Moment(this.props.deal.startAt).toArray()}/>
                ) : (
                  "soon"
                )}
              </Text>
              <Text style={[styles.title, styles.subTitle]}>
                {this.props.deal.quantityAvailable
                  ? this.isActive
                    ? `${this.props.deal.quantityAvailable} left`
                    : `${this.props.deal.quantityAvailable} available`
                  : "sold out"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {},

  content: {
    padding: Sizes.InnerFrame,
    backgroundColor: Colours.MenuBackground
  },

  stats: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginTop: Sizes.InnerFrame / 4,
    alignItems: "flex-start"
  },

  title: {
    ...Styles.Text,
    ...Styles.Title,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  subTitle: {
    ...Styles.SmallText,
    marginBottom: Sizes.InnerFrame / 3
  }
});
