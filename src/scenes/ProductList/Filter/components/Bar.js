import React from "react";
import { View, StyleSheet } from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";

import { Colours, Sizes } from "localyyz/constants";

// local
import Brands from "./Brand";
import FilterButton from "./FilterButton";
import SortBy from "./SortBy";

export const BAR_HEIGHT = Sizes.Button + Sizes.InnerFrame / 2;

@inject(stores => ({
  store: stores.filterStore
}))
@observer
export class Bar extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <SortBy id="sortBy" label="SORT" value="" {...this.props} isButton />
        <FilterButton
          id="filterAll"
          label="FILTER"
          value="filter all"
          {...this.props}
          isButton/>
      </View>
    );
  }
}

export default withNavigation(Bar);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame / 2,
    height: BAR_HEIGHT,
    backgroundColor: Colours.Foreground
  }
});
