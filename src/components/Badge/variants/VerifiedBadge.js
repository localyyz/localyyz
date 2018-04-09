import React from "react";

// custom
import Badge from "../index";
import { Colours } from "localyyz/constants";

export default class VerifiedBadge extends React.Component {
  render() {
    return (
      <Badge color={Colours.Primary} icon="check-circle">
        Top Merchant
      </Badge>
    );
  }
}
