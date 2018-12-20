import React from "react";

// third party
import { inject } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  asyncFetch: stores.filterStore.fetchColors,
  setFilter: stores.filterStore.setColorFilter,
  clearFilter: () => stores.filterStore.setColorFilter(),
}))
export default class Colors extends React.Component {
  render() {
    return <Common title="color" id="color" {...this.props} />;
  }
}
