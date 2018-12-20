import React from "react";

// third party
import { inject, observer } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  store: stores.filterStore,
  setFilter: stores.filterStore.setMerchantFilter,
  asyncFetch: stores.filterStore.fetchMerchants,
  clearFilter: () => stores.filterStore.setMerchantFilter()
}))
@observer
export default class Merchants extends React.Component {
  render() {
    return <Common {...this.props} id="merchant" title="Stores" />;
  }
}
