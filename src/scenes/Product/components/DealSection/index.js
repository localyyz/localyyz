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
  product: stores.productStore.product
}))
@observer
export default class DealSection extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.settings.activeDealStore;
  }

  get isActive() {
    return Moment(this.store.deal.endAt).diff(this.props.now) > 0;
  }

  render() {
    return this.store ? (
      <View style={styles.container}>
        <ProgressBar progress={this.store.progress} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{"Today's deal"}</Text>
            <View style={styles.stats}>
              <Text style={[styles.title, styles.subTitle]}>
                <Text>ending in </Text>
                {this.store.deal ? (
                  <Timer
                    target={Moment(this.store.deal.endAt).toArray()}
                    onComplete={() =>
                      this.props.navigation && this.props.navigation.goBack()
                    }/>
                ) : (
                  "soon"
                )}
              </Text>
              <Text style={[styles.title, styles.subTitle]}>
                {`${this.store.deal.quantityAvailable} left (${Math.round(
                  this.store.deal.percentageClaimed * 100
                )}% claimed)`}
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
    paddingHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.OuterFrame,
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
