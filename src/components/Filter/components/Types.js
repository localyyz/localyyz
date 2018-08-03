import React from "react";
// third party
import { inject, observer } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchBrands,
  setFilter: stores.filterStore.setBrandFilter,
  clearFilter: () => stores.filterStore.setBrandFilter(),
  data: stores.filterStore.brands,
  selected: stores.filterStore.brand
}))
@observer
export class Brands extends React.Component {
  render() {
    return <Common title="By brand" id="brands" {...this.props} />;
  }
}

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchColors,
  setFilter: stores.filterStore.setColorFilter,
  clearFilter: () => stores.filterStore.setColorFilter(),
  data: stores.filterStore.colors,
  selected: stores.filterStore.color
}))
@observer
export class Colors extends React.Component {
  render() {
    return <Common title="By color" id="colors" {...this.props} />;
  }
}

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchSizes,
  setFilter: stores.filterStore.setSizeFilter,
  clearFilter: () => stores.filterStore.setSizeFilter(),
  data: stores.filterStore.sizes,
  selected: stores.filterStore.size
}))
@observer
export class Sizes extends React.Component {
  render() {
    return <Common title="By size" id="sizes" {...this.props} />;
  }
}
