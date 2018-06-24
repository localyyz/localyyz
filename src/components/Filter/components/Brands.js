import React from "react";
// third party
import { inject, observer } from "mobx-react/native";

import Common from "./Common";

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchBrands,
  setFilter: stores.filterStore.setBrandFilter,
  clearFilter: () => stores.filterStore.setBrandFilter(""),
  data: stores.filterStore.brands,
  selected: stores.filterStore.brand
}))
@observer
export default class Brands extends React.Component {
  render() {
    return <Common {...this.props} />;
  }
}
