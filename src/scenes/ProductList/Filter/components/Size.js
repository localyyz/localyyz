import React from "react";

// third party
import { inject, observer } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchSizes,
  setFilter: stores.filterStore.setSizeFilter,
  clearFilter: () => stores.filterStore.setSizeFilter()
}))
@observer
export default class Sizes extends React.Component {
  render() {
    return <Common title="size" id="size" {...this.props} />;
  }
}
