import React from "react";
import { View, StyleSheet } from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";

import { Sizes } from "localyyz/constants";

// local
import { Brands, FilterButton } from "./Types";
import SortBy from "./SortBy";

@inject(stores => ({
  store: stores.filterStore
}))
@observer
export class Bar extends React.Component {
  // options to display on the filter bar
  BarOptions = [
    // TODO: gender?
    { id: "brands", label: "Brands", value: "/brands", component: Brands },
    { id: "sortBy", label: "Sort By", value: "", component: SortBy },
    {
      id: "filterAll",
      label: "Filter",
      value: "filter all",
      component: withNavigation(FilterButton)
    }
  ];

  renderItem = ({ item }) => {
    return <item.component {...item} isButton />;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.BarOptions.map(b => {
          return (
            <b.component key={b.id} {...b} store={this.props.store} isButton />
          );
        })}
      </View>
    );
  }
}

export default withNavigation(Bar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginBottom: Sizes.InnerFrame
  }
});
