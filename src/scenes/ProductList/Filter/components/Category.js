import React from "react";

// third party
import { inject, observer } from "mobx-react/native";

// common component types
import Common from "./Common";

@inject(stores => ({
  store: stores.filterStore,
  asyncFetch: stores.filterStore.fetchCategories,
  setFilter: stores.filterStore.setCategoryFilter,
  clearFilter: () => stores.filterStore.setCategoryFilter([])
}))
@observer
export default class Categories extends React.Component {
  render() {
    return (
      <Common
        {...this.props}
        data={this.data}
        title="category"
        id="categoryValue"/>
    );
  }
}
