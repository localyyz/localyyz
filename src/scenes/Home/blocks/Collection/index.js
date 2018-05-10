import React from "react";

// custom
import { ApiInstance } from "localyyz/global";
import { Product } from "localyyz/models";
import { Colours } from "localyyz/constants";
import { box } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { observable, reaction } from "mobx";
import { observer, inject } from "mobx-react";
import { lazyObservable } from "mobx-utils";

// local
import { StandardCollection } from "./components";

@inject("loginStore")
@observer
export default class Collection extends React.Component {
  @observable products;
  @box numProducts = 0;

  static propTypes = {
    fetchFrom: PropTypes.string.isRequired,
    withMargin: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    limit: PropTypes.number,
    backgroundColor: PropTypes.string
  };

  static defaultProps = {
    limit: 4,
    withMargin: false,
    backgroundColor: Colours.Background
  };

  constructor(props) {
    super(props);

    // setup the items
    this.products = lazyObservable(sink =>
      ApiInstance.get(this.props.fetchFrom, { limit: this.props.limit }).then(
        response => {
          this.numProducts
            = (response
              && response.headers
              && parseInt(response.headers["x-item-total"]))
            || 0;

          return sink(
            (response.data || [])
              .filter(p => p.images && p.images.length > 0)
              .map(
                p =>
                  new Product({
                    ...p,
                    description: p.noTagDescription,
                    titleWordsLength: 3,
                    descriptionWordsLength: 10
                  })
              )
          );
        }
      )
    );
  }

  reactLogin = reaction(
    () => {
      return {
        success: this.props.loginStore._wasLoginSuccessful,
        skipped: this.props.loginStore._wasLoginSkipped
      };
    },
    ({ success, skipped }) => {
      if (success || skipped) {
        this.products && this.products.refresh();
      }
    }
  );

  render() {
    return (
      <StandardCollection
        {...this.props}
        listData={this.products}
        imageUrl={this.props.imageUrl}
        numProducts={this.numProducts}
        backgroundColor={
          this.props.withMargin ? Colours.Foreground : Colours.Background
        }/>
    );
  }
}
