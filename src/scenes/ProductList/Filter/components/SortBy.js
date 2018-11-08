import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import ActionSheet from "react-native-actionsheet";
import PropTypes from "prop-types";

import { Styles, Colours, Sizes } from "localyyz/constants";

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
    if (sortByIndex !== this.props.store.sortBys.length) {
      const selected = this.props.store.sortBys[sortByIndex];
      this.props.store.setSortBy(selected.value);

      this.setState({ selected: selected });
    }
  };

  showSortBy = () => {
    this.actionSheet.show();
  };

  render() {
    return (
      <View>
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
              {this.state.selected.label || "Sort"}
            </Text>
          </View>
        </TouchableOpacity>

        <ActionSheet
          ref={ref => (this.actionSheet = ref)}
          title={"Sort By"}
          options={[
            ...this.props.store.sortBys.slice().map(s => s.label),
            "Cancel"
          ]}
          cancelButtonIndex={this.props.store.sortBys.length}
          onPress={this.onPress}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  option: {
    borderRadius: Sizes.RoundedBorders,

    marginTop: 1,
    justifyContent: "space-around",

    flex: 1,
    width: Sizes.Width / 3,
    maxWidth: Sizes.Width / 3,
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
