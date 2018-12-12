import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import ActionSheet from "react-native-actionsheet";
import PropTypes from "prop-types";

import { Styles, Colours, Sizes } from "localyyz/constants";

const SORT_BYS = [
  { label: "Recommended" },
  { label: "What's new", value: "-created_at" },
  { label: "Price (Low to high)", value: "price" },
  { label: "Price (High to low)", value: "-price" },
  { label: "Discount (High to low, % off)", value: "-discount" }
];

export default class SortBy extends React.Component {
  static propTypes = {
    // mobx store
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { selected: {} };
  }

  onPress = sortByIndex => {
    if (sortByIndex !== SORT_BYS.length) {
      const selected = SORT_BYS[sortByIndex];
      this.props.store.setSortBy(selected.value);

      this.setState({ selected: selected });
    }
  };

  showSortBy = () => {
    this.actionSheet.show();
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={this.showSortBy}
          hitSlop={{
            top: Sizes.InnerFrame * 2,
            bottom: Sizes.InnerFrame * 2,
            left: Sizes.InnerFrame,
            right: Sizes.InnerFrame
          }}>
          <View style={styles.option}>
            <Text
              style={[styles.optionValue]}
              testID="sortBy"
              numberOfLines={1}>
              {this.state.selected.label || this.props.label}
            </Text>
          </View>
        </TouchableOpacity>

        <ActionSheet
          ref={ref => (this.actionSheet = ref)}
          title={"Sort By"}
          options={[...SORT_BYS.slice().map(s => s.label), "Cancel"]}
          cancelButtonIndex={SORT_BYS.length}
          onPress={this.onPress}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  option: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: Sizes.RoundedBorders,
    justifyContent: "space-around",

    height: Sizes.Width / 8,
    marginHorizontal: Sizes.InnerFrame / 4,
    paddingHorizontal: Sizes.InnerFrame / 4,
    paddingVertical: Sizes.InnerFrame / 4,
    backgroundColor: Colours.Action
  },

  optionValue: {
    paddingLeft: Sizes.InnerFrame / 2,
    maxWidth: Sizes.Width / 3,
    ...Styles.SmallText,
    ...Styles.Emphasized
  }
});
