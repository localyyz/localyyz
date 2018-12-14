import React from "react";

// third party
import { inject, observer } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  setFilter: stores.filterStore.setPriceFilter,
  asyncFetch: stores.filterStore.fetchPrices,
  clearFilter: () => () => {}
}))
@observer
export default class Price extends React.Component {
  render() {
    return (
      <Common
        {...this.props}
        id="price"
        title="price"
        scene="FilterPriceList"/>
    );
  }
}
