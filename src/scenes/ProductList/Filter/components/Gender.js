import React from "react";

// third party
import { inject, observer } from "mobx-react/native";

// common component types
import Common from "./Common";

const GENDERS = ["man", "woman"];

@inject(stores => ({
  setFilter: stores.filterStore.setGenderFilter,
  clearFilter: () => stores.filterStore.setGenderFilter()
}))
@observer
export default class Gender extends React.Component {
  render() {
    return (
      <Common
        title="gender"
        id="gender"
        asyncFetch={() => new Promise.resolve({ data: GENDERS })}
        {...this.props}/>
    );
  }
}
