import React from "react";
import { StyleSheet, Animated } from "react-native";
import { Sizes } from "localyyz/constants";

export default class LiquidImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    // animated loading
    this._blur = new Animated.Value(0);

    // bindings
    this.update = this.update.bind(this);
    this.sourceFrom = this.sourceFrom.bind(this);
  }

  componentDidMount() {
    this.update(this.props);
  }

  UNSAFE_componentWillReceiveProps(next) {
    if (next != this.props) {
      this.update(next);
    }
  }

  update(props) {
    let dimensions = _dimensions(props.square, props.w, props.h);
    this.setState({
      width: dimensions[0],
      height: dimensions[1]
    });
  }

  sourceFrom(props) {
    return _filter(props.source.uri, [
      // resizing
      ...(props.w || props.h
        ? [
            `${this.state.height ? this.state.height * 2 : ""}x${
              this.state.width ? this.state.width * 2 : ""
            }`
          ]
        : []),

      // cropping
      ...(props.crop ? [`crop_${props.crop}`] : [])
    ]);
  }

  get source() {
    return this.sourceFrom(this.props);
  }

  render() {
    const blurRadius = this._blur.interpolate({
      inputRange: [0, 0.1, 0.2, 0.4, 0.5, 0.6, 0.8, 1],
      outputRange: [20, 17, 14, 11, 9, 6, 3, 0],
      extrapolate: "clamp"
    });
    return this.props.source && this.props.source.uri && this.source ? (
      <Animated.Image
        {...this.props}
        blurRadius={blurRadius}
        onProgress={({ nativeEvent: { loaded, total } }) => {
          if (loaded / total < 1) {
            this._blur.setValue(loaded / total);
          }
        }}
        onLoad={() => this._blur.setValue(1)}
        resizeMode={this.props.resizeMode || "contain"}
        source={{
          ...this.props.source,
          ...(this.props.source && this.props.source.uri
            ? {
                uri: this.source
              }
            : null)
        }}
        style={[
          styles.container,
          this.props.style,
          this.props.h || this.props.w
            ? {
                height: this.state.height,
                width: this.state.width
              }
            : null
        ]}
      />
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
    parts.slice(0, parts.length - 1).join("/") +
    "/" +
    name.slice(0, name.length - 1).join(".") +
    options.map(option => `_${option}`).join("") +
    ".progressive." +
    name[name.length - 1]
  );
}

function _dimensions(square, width, height) {
  return [
    Math.round(width || (square && height)) || null,
    Math.round(height || (square && width)) || null
  ];
}
