import React from "react";

// custom
import Badge from "../index";
import { Colours } from "localyyz/constants";

export default class DiscountBadge extends React.Component {
  render() {
    return (
      <Badge color={Colours.Accented} {...this.props}>
        {`${(this.props.product.discount * 100).toFixed(0)}% off`}
      </Badge>
    );
  }
}
