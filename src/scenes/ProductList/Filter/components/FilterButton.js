import React from "react";

// third party
import { inject, observer } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  store: stores.filterStore,
  asyncFetch: () => {},
  setFilter: () => {},
  clearFilter: () => () => {},
  selected: ""
}))
@observer
export default class FilterButton extends React.Component {
  onPress = () => {
    this.props.navigation.push("Filter", {
      title: "Filter",
      store: this.props.store
    });
  };

  render() {
    const title = this.props.store.numFilters
      ? `Filter (${this.props.store.numFilters})`
      : this.props.label;

    return (
      <Common
        title={title}
        icon="playlist-add"
        id="filter"
        onPress={this.onPress}
        {...this.props}/>
    );
  }
}
