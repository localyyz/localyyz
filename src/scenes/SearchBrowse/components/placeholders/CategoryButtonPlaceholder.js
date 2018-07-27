import React from "react";
import { View } from "react-native";

// third party
import Placeholder from "rn-placeholder";
import PropTypes from "prop-types";

// local
import { WIDTH, HEIGHT, RIGHT_MARGIN } from "../CategoryButton";

export default class CategoryButtonPlaceholder extends React.Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    marginRight: PropTypes.number
  };

  static defaultProps = {
    width: WIDTH,
    height: HEIGHT,
    marginRight: RIGHT_MARGIN
  };

  render() {
    return (
      <View
        style={{
          marginRight: this.props.marginRight
        }}>
        <Placeholder.Box
          animate="fade"
          width={this.props.width}
          height={this.props.height}/>
      </View>
    );
  }
}
