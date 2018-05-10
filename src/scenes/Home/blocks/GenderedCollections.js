import React from "react";

// custom
import { ApiInstance } from "localyyz/global";

// third party
import PropTypes from "prop-types";
import { observable } from "mobx";
import { lazyObservable } from "mobx-utils";
import { observer } from "mobx-react";

// local
import Collection from "./Collection";

@observer
export default class GenderedCollections extends React.Component {
  @observable collections;

  static propTypes = {
    isMale: PropTypes.bool
  };

  static defaultProps = {
    isMale: false
  };

  constructor(props) {
    super(props);

    // setup collections
    this.collections = lazyObservable(sink =>
      ApiInstance.get("collections/woman").then(response => sink(response.data))
    );
  }

  render() {
    let collections = this.collections.current();
    return collections
      ? collections.map((collection, i) => (
          <Collection
            fetchFrom={`collections/${collection.id}/products`}
            title={collection.name}
            description={collection.description}
            imageUrl={collection.imageUrl}
            key={`collection-${i}`}/>
        ))
      : null;
  }
}
