import React from "react";
import { View } from "react-native";

// third party
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class ReactiveSpacer extends React.Component {
  static propTypes = {
    store: PropTypes.any.isRequired,
    heightProp: PropTypes.string.isRequired
  };

  render() {
    const { store, heightProp } = this.props;
    return <View style={{ paddingTop: store[heightProp] }} />;
  }
}