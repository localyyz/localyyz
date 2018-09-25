import React from "react";

// custom
import { ApiInstance } from "localyyz/global";
import { Product } from "localyyz/stores";
import { Colours } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { observable, runInAction } from "mobx";
import { observer, inject } from "mobx-react/native";

// local
import { List } from "../components";

@inject(stores => ({
  wasLoginSuccessful: stores.loginStore._wasLoginSuccessful,
  genderFilter:
    stores.userStore.gender === "male"
      ? "man"
      : stores.userStore.gender === "female" ? "woman" : null
}))
@observer
export default class Collection extends React.Component {
  @observable products = [];
  @observable numProducts = 0;

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

  componentDidMount() {
    // setup the items
    ApiInstance.get(this.props.fetchFrom, {
      filter: this.props.genderFilter
        ? `gender,val=${this.props.genderFilter}`
        : null,
      limit: this.props.limit
    }).then(resolved => {
      if (!resolved.error) {
        runInAction("[ACTION] fetch collection", () => {
          this.numProducts
            = (resolved.headers && parseInt(resolved.headers["x-item-total"]))
            || 0;
          this.products = (resolved.data || []).map(p => new Product(p));
        });
      }
    });
  }

  render() {
    return (
      <List
        {...this.props}
        listData={this.products}
        fetchPath={this.props.fetchFrom}
        numProducts={this.numProducts}
        backgroundColor={
          this.props.withMargin ? Colours.Foreground : Colours.Background
        }/>
    );
  }
}
