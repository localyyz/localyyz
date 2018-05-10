import React from "react";
import { Animated, Image, ImageBackground } from "react-native";

// third party
import { action, observable } from "mobx";
import { observer } from "mobx-react";

import PropTypes from "prop-types";

export default class ConstrainedAspectImage extends React.Component {
  static propTypes = {
    ...Image.PropTypes,

    constrainWidth: PropTypes.number,
    constrainHeight: PropTypes.number
  };

  static defaultProps = {
    ...Image.defaultProps
  };

  constructor(props) {
    super(props);

    // NOTE: opted for native states because there's no way
    // to sanely do shouldComponentUpdate with mobx observables
    //
    // this means we'll have to set a flag on componentWillUnmount
    // to cancel any callback setstates
    //
    // TODO: is the best way to do this wrap getImage onSuccess/onError
    // in one more layer of Promise?
    this.state = {
      width: null,
      height: null,
      failed: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.width !== null || nextState.failed;
  }

  componentWillUnmount() {
    // onSuccess and onError that goes no where
    this._hasUnmounted = true;
  }

  componentDidMount() {
    if (this.props.constrainWidth || this.props.constrainHeight) {
      this.fetchImageSizeOnce();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.source
      && nextProps.source.uri
      && (!!nextProps.constrainWidth || !!nextProps.constrainHeight)
    ) {
      this.fetchImageSizeOnce();
    }
  }

  fetchImageSizeOnce = () => {
    if (!this._hasFetched) {
      Image.getSize(this.props.source.uri, this.onSuccess, this.onError);
      this._hasFetched = true;
    }
  };

  onSuccess = (width, height) => {
    if (!this._hasUnmounted) {
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

      this.setState({ width, height });
    }
  };

  onError = err => {
    if (!this._hasUnmounted) {
      this.setState({ failed: true });
      console.log(
        `Image failed to load: ${this.props.source && this.props.source.uri} (${
          err.message
        })`
      );
    }
  };

  get baseComponent() {
    return this.props.children ? ImageBackground : Animated.Image;
  }

  render() {
    return !this.state.failed && !!this.state.width ? (
      <this.baseComponent
        {...this.props}
        resizeMode="contain"
        style={[
          ...(this.props.style || []),
          this.state.width && this.state.height
            ? {
                width: this.state.width,
                height: this.state.height
              }
            : {}
        ]}/>
    ) : null;
  }
}
