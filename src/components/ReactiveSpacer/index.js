import React from "react";
import { View } from "react-native";

// third party
import PropTypes from "prop-types";
import { observer } from "mobx-react/native";

@observer
export default class ReactiveSpacer extends React.Component {
  static propTypes = {
    store: PropTypes.any.isRequired,
    heightProp: PropTypes.string.isRequired,
    offset: PropTypes.number
  };

  static defaultProps = {
    offset: 0
  };

  render() {
    const { store, heightProp } = this.props;
    return (
      <View
        style={{
          paddingTop: Math.max(0, store[heightProp] - this.props.offset)
        }}/>
    );
  }
}
