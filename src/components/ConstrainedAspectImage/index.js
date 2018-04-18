import React from "react";
import { Animated, Image } from "react-native";

// third party
import { action, observable } from "mobx";
import { observer } from "mobx-react";

import PropTypes from "prop-types";

@observer
export default class ConstrainedAspectImage extends React.Component {
  @observable width = null;
  @observable height = null;
  @observable failed = false;

  static propTypes = {
    ...Image.PropTypes,

    constrainWidth: PropTypes.number,
    constrainHeight: PropTypes.number
  };

  static defaultProps = {
    ...Image.defaultProps
  };

  @action
  onSuccess = (width, height) => {
    const { constrainHeight, constrainWidth } = this.props;

    let ratio;
    // first, width constrain respecting aspect
    if (constrainWidth && width > constrainWidth) {
      ratio = height / width;
      width = constrainWidth;
      height = width * ratio;
    }

    // then, height constrain with new adjustments from above
    if (constrainHeight && height > constrainHeight) {
      ratio = width / height;
      height = constrainHeight;
      width = height * ratio;
    }

    this.width = width;
    this.height = height;
  };

  @action
  onError = err => {
    this.failed = true;
    console.log(
      `Image failed to load: ${this.props.source && this.props.source.uri} (${
        err.message
      })`
    );
  };

  componentDidMount() {
    if (this.props.source && this.props.source.uri) {
      Image.getSize(this.props.source.uri, this.onSuccess, this.onError);
    }
  }

  render() {
    return !this.failed ? (
      <Animated.Image
        {...this.props}
        resizeMode="contain"
        style={[
          ...(this.props.style || []),
          this.width && this.height
            ? {
                width: this.width,
                height: this.height
              }
            : {}
        ]}/>
    ) : null;
  }
}
