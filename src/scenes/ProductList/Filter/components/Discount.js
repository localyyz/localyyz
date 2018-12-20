import React from "react";

// third party
import { inject, observer } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  setFilter: stores.filterStore.setDiscountFilter,
  store: stores.filterStore
}))
@observer
export default class Discounts extends React.Component {
  render() {
    return (
      <Common
        {...this.props}
        id="discount"
        title="Sales & Deals"
        scene="FilterDiscountList"/>
    );
  }
}
