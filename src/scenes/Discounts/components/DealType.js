import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";

const DEALTAB = [
  { id: "ongoing", label: "ONGOING", filterId: "ongoing" },
  { id: "timed", label: "LIMITED TIME", filterId: "timed" },
  { id: "comingsoon", label: "COMING SOON", filterId: "comingsoon" }
];

@inject((stores, props) => ({
  fetch: stores.dealStore.fetchFeaturedDeals,
  dealTab: (stores.dealStore || props).dealTab,
  setDealTab: (stores.dealStore || props).setDealTab,
  featuredDeals: stores.dealStore.featuredDeals
    ? stores.dealStore.featuredDeals.slice()
    : []
}))
@observer
export default class DealType extends React.Component {
  componentDidMount() {
    this.props.setDealTab({ id: "ongoing" });
  }

  render() {
    return (
      <View>
        <View>
          <Text style={styles.instructions}>
            Enter applicable discount codes at checkout to see if your cart is
            eligible for even more savings!
          </Text>
        </View>
        <View style={styles.container}>
          {DEALTAB.map(dealTab => (
            <TouchableOpacity
              key={`dealTab-${dealTab.id}`}
              onPress={() => this.props.setDealTab(dealTab)}>
              <View style={styles.button}>
                <View
                  style={[
                    styles.option,
                    this.props.dealTab
                      && this.props.dealTab.id == dealTab.id
                      && styles.active
                  ]}>
                  <Text style={styles.label}>{dealTab.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    padding: Sizes.InnerFrame,
    width: Sizes.Width,
    justifyContent: "space-evenly",
    backgroundColor: Colours.Foreground,
    borderBottomColor: Colours.Background,
    borderBottomWidth: 2
  },

  button: {
    alignItems: "center",
    justifyContent: "center"
  },

  option: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.InnerFrame / 4,
    paddingHorizontal: Sizes.OuterFrame * 2 / 3,
    borderRadius: Sizes.InnerFrame
  },

  active: {
    backgroundColor: Colours.Action
  },

  label: {
    fontWeight: Sizes.Normal,
    fontSize: 15,
    color: Colours.Text,
    backgroundColor: Colours.Transparent,
    ...Styles.Emphasized
  },

  instructions: {
    ...Styles.Subdued,
    fontSize: 13,
    backgroundColor: Colours.Foreground,
    paddingHorizontal: Sizes.InnerFrame,
    alignItems: "center",
    textAlign: "center"
  }
});
