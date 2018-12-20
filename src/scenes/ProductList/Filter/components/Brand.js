import React from "react";

// third party
import { inject } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchBrands,
  setFilter: stores.filterStore.setBrandFilter,
  clearFilter: () => stores.filterStore.setBrandFilter()
}))
export default class Brands extends React.Component {
  render() {
    return <Common title="brands" id="brand" {...this.props} />;
  }
}
