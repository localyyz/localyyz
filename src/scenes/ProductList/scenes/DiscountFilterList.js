import React from "react";
import { View, StyleSheet, Text } from "react-native";

import MultiSlider from "@ptomasroos/react-native-multi-slider";

// custom
import { Colours, Sizes } from "localyyz/constants";

export default class DiscountFilterList extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    title: "Sales & Discounts"
  });

  constructor(props) {
    super(props);

    this.store = this.props.navigation.getParam("filterStore", {});
    // NOTE: navigation state params
    //  id
    //  title
    //  selectedValue
    //  selected
    //  asyncFetch
    //  clearFilter
    //  setFilter
    //  filterStore
    this.state = { min: 0, max: 99, selected: this.store.discountMin || 0 };
  }

  onSelect = values => {
    //GA.trackEvent("filter/sort", "filter by discount", `${min}%`);
    this.setState(
      {
        selected: values[0]
      },
      () => {
        this.props.navigation.getParam("setFilter")(this.state.selected);
      }
    );
  };

  render() {
    const sliderLength = Sizes.Width - 4 * Sizes.OuterFrame;
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: sliderLength, // base slider width
            paddingBottom: Sizes.OuterFrame
          }}>
          <Text>Show on sale, over {this.state.selected}% Off</Text>
        </View>
        <MultiSlider
          values={[this.state.selected]}
          onValuesChange={this.onSelect}
          sliderLength={sliderLength}
          step={10}
          min={this.state.min}
          max={this.state.max}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground,
    justifyContent: "center",
    alignItems: "center",
    height: Sizes.Height / 3,
    paddingHorizontal: Sizes.OuterFrame
  }
});
