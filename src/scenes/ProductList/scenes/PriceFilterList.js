import React from "react";
import { View, StyleSheet, Text } from "react-native";

import MultiSlider from "@ptomasroos/react-native-multi-slider";

// custom
import { Colours, Sizes } from "localyyz/constants";

export default class PriceFilterList extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    title: "Price"
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
    this.state = {
      minPrice: 0,
      maxPrice: 0
    };
  }

  componentDidMount() {
    this.props.navigation
      .getParam("asyncFetch")()
      .then(response => {
        if (response && response.data && response.data.length == 2) {
          const min = parseInt(response.data[0]);
          const max = parseInt(response.data[1]);
          this.setState({
            minPrice: min,
            maxPrice: max,
            selectedMin: this.store.priceMin || min,
            selectedMax: this.store.priceMax || max
          });
        }
      });
  }

  onSelect = values => {
    //GA.trackEvent(
    //"filter/sort",
    //"filter by price",
    //max ? `$${min} - $${max}` : `$${min}+`
    //);
    this.setState(
      {
        selectedMin: values[0],
        selectedMax: values[1]
      },
      () => {
        this.props.navigation.getParam("setFilter")(
          this.state.selectedMin,
          this.state.selectedMax
        );
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
          <Text>${this.state.selectedMin}</Text>
          <Text>${this.state.selectedMax}</Text>
        </View>
        <MultiSlider
          enabledOne
          enabledTwo
          values={[this.state.selectedMin, this.state.selectedMax]}
          onValuesChange={this.onSelect}
          sliderLength={sliderLength}
          min={this.state.minPrice}
          max={this.state.maxPrice}/>
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
