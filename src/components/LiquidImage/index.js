import React from "react";
import { StyleSheet, Animated, Image } from "react-native";

import PropTypes from "prop-types";

export default class LiquidImage extends React.Component {
  static propTypes = {
    ...Image.propTypes,

    square: PropTypes.bool,
    crop: PropTypes.string,
    w: PropTypes.number,
    h: PropTypes.number
  };

  static defaultProps = {
    ...Image.defaultProps,

    square: false,
    crop: "",
    resizeMode: "contain"
  };

  constructor(props) {
    super(props);

    this.state = {
      resizeFailed: false
    };

    // animated loading
    this._blur = new Animated.Value(0);

    // bindings
    this.sourceFrom = this.sourceFrom.bind(this);
  }

  // there's no state modification in source from. it's a
  // pure function
  sourceFrom(props = this.props) {
    const { resizeFailed } = this.state;
    const { square, w, h, crop, source } = props;

    const dimensions = _dimensions(square, w, h);
    const width = dimensions[0];
    const height = dimensions[1];

    return resizeFailed
      ? source.uri
      : _filter(source.uri, [
          // resizing
          ...(width || height
            ? [`${height ? height * 2 : ""}x${width ? width * 2 : ""}`]
            : []),

          // cropping
          ...(crop ? [`crop_${crop}`] : [])
        ]);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.w !== this.props.w || nextProps.h !== this.props.h) {
      Image.getSize(
        this.sourceFrom(nextProps),
        () => {},
        () => {
          console.log(`Failed loading ${this.sourceFrom(nextProps)}`);
          this.setState(
            {
              resizeFailed: true
            },
            () => console.log(`Reverting to ${this.sourceFrom(nextProps)}`)
          );
        }
      );
    }
  }

  get source() {
    return this.sourceFrom();
  }

  render() {
    const { source, square, w, h, resizeMode, style } = this.props;

    const dimensions = _dimensions(square, w, h);
    const width = dimensions[0];
    const height = dimensions[1];

    return (width || height) && source && source.uri && this.source ? (
      <Animated.Image
        {...this.props}
        blurRadius={this._blur.interpolate({
          inputRange: [0, 0.5, 0.6, 0.8, 1],
          outputRange: [20, 9, 6, 3, 0],
          extrapolate: "clamp"
        })}
        resizeMode={resizeMode}
        onLoad={() => {
          Animated.timing(this._blur, { toValue: 1 }, { duration: 40 }).start();
        }}
        source={{
          ...source,
          ...(source && source.uri
            ? {
                uri: this.source
              }
            : null)
        }}
        style={[
          styles.container,
          style,
          width || height
            ? {
                height: height,
                width: width
              }
            : null
        ]}/>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {}
});

function _filter(base, options) {
  let parts = base.split("/");
  let name = parts[parts.length - 1].split(".");

  return (
    parts.slice(0, parts.length - 1).join("/")
    + "/"
    + name.slice(0, name.length - 1).join(".")
    + options.map(option => `_${option}`).join("")
    + ".progressive."
    + name[name.length - 1]
  );
}

function _dimensions(square, width, height) {
  return [
    Math.round(width || (square && height)) || null,
    Math.round(height || (square && width)) || null
  ];
}
