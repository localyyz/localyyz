import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";

import IonIcon from "react-native-vector-icons/Ionicons";

// third party
//import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";
import { GA } from "localyyz/global";

// constants
const SHOW_ALL_LABEL = "Show all";

export default class PriceFilterList extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    header: undefined,
    title: "Price"
  });

  constructor(props) {
    super(props);

    this.filterStore = this.props.navigation.getParam("filterStore", {});
    // NOTE: navigation state params
    //  id
    //  title
    //  selectedValue
    //  selected
    //  asyncFetch
    //  clearFilter
    //  setFilter
    //  filterStore
    this.data = [SHOW_ALL_LABEL, ...this.filterStore.prices.slice()];
  }

  onSelect = ({ min, max }) => {
    GA.trackEvent(
      "filter/sort",
      "filter by price",
      max ? `$${min} - $${max}` : `$${min}+`
    );
    const fn = this.props.navigation.getParam("setFilter");
    fn(min, max);

    return this.props.navigation.goBack(null);
  };

  renderItem = ({ item }) => {
    const selectedValue = this.props.navigation.getParam("selectedValue", {});

    return item === SHOW_ALL_LABEL ? (
      <View style={[styles.wrapper, styles.topWrapper]}>
        <TouchableOpacity onPress={() => this.onSelect({})}>
          <View style={styles.topOption}>
            <Text style={styles.topOptionLabel}>All Prices</Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={[styles.wrapper]}>
        <TouchableOpacity onPress={() => this.onSelect(item)}>
          <View style={styles.option}>
            <Text style={styles.optionLabel}>
              {item.max !== undefined
                ? `$${item.min} - $${item.max}`
                : `$${item.min}+`}
            </Text>
            <View>
              {selectedValue.min === item.min
                && selectedValue.max === item.max && (
                  <IonIcon name="ios-checkmark" size={30} color="black" />
                )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <FlatList
        data={this.data}
        keyExtractor={(_, i) => `filter${this.props.id}${i}`}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        style={styles.container}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  content: {
    paddingBottom: NAVBAR_HEIGHT,
    paddingHorizontal: Sizes.InnerFrame
  },

  wrapper: {
    justifyContent: "center",
    paddingVertical: Sizes.InnerFrame,
    borderBottomWidth: Sizes.Hairline,
    borderColor: Colours.Border
  },

  topWrapper: {
    paddingTop: Sizes.InnerFrame,
    justifyContent: "center"
  },

  topOption: {
    borderWidth: 1,
    height: Sizes.InnerFrame * 3,
    justifyContent: "center"
  },

  option: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Sizes.InnerFrame / 2
  },

  optionLabel: {
    ...Styles.Title,
    ...Styles.Emphasized
  },

  topOptionLabel: {
    ...Styles.Emphasized,
    textAlign: "center"
  }
});
