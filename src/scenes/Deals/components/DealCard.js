import React from "react";

// third party
import { inject, observer } from "mobx-react/native";
import Moment from "moment";

// local
import ActiveCard from "./ActiveCard";
import UpcomingCard from "./UpcomingCard";

@inject(stores => ({
  now: stores.dealStore.now
}))
@observer
export default class DealCard extends React.Component {
  render() {
    let start = Moment(this.props.start ? this.props.start.slice() : null);
    let end = Moment(this.props.end ? this.props.end.slice() : null);

    return start.diff(this.props.now) > 0 ? (
      <UpcomingCard {...this.props} />
    ) : end.diff(this.props.now) > 0 ? (
      <ActiveCard {...this.props} />
    ) : null;
  }
}
