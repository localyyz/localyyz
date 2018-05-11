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

    this.state = {
      aspectImageUrl: null
    };
    if (props.constrainWidth) {
      this.state = {
        aspectImageUrl: imgURL(
          props.source.uri,
          `${Math.round(this.props.constrainWidth) * 2}x`
        )
      };
    }
  }

  get baseComponent() {
    return this.props.children ? ImageBackground : Image;
  }

  componentWillReceiveProps(nextProps) {
    if (
      Math.round(nextProps.constrainWidth)
      !== Math.round(this.props.constrainWidth)
    ) {
      this.setState({
        aspectImageUrl: imgURL(
          nextProps.source.uri,
          `${Math.round(nextProps.constrainWidth) * 2}x`
        )
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  render() {
    return this.state.aspectImageUrl ? (
      <this.baseComponent
        {...this.props}
        source={{
          uri: this.state.aspectImageUrl
        }}
        resizeMode="contain"
        onError={({ nativeEvent: { error } }) => {
          error
            && console.log(
              `image ${this.state.aspectImageUrl} failed to load with ${error}`
            );
        }}
        style={[
          ...(this.props.style || []),
          this.props.constrainWidth
            ? {
                width: this.props.constrainWidth,
                height: this.props.constrainHeight
              }
            : {}
        ]}/>
    ) : null;
  }
}

// via: https://gist.github.com/DanWebb/cce6ab34dd521fcac6ba
function imgURL(src, size) {
  // remove any current image size then add the new image size
  return src
    .replace(
      /_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g,
      "."
    )
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function(match) {
      return "_" + size + match;
    });
}
