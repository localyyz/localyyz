import React from "react";
import { StyleSheet, Animated, Easing, Image } from "react-native";

// third party
import { observable, computed, runInAction } from "mobx";
import { observer } from "mobx-react";
import PropTypes from "prop-types";

@observer
export default class LiquidImage extends React.Component {
  @observable resizeFailed = false;

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

    // animated loading
    this._blur = new Animated.Value(0);

    // bindings
    this.sourceFrom = this.sourceFrom.bind(this);
  }

  // there's no state modification in source from. it's a
  // pure function
  sourceFrom(props = this.props) {
    const { square, w, h, crop, source } = props;

    const dimensions = _dimensions(square, w, h);
    const width = dimensions[0];
    const height = dimensions[1];

    return this.resizeFailed
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
      const source = this.sourceFrom(nextProps);
      Image.getSize(
        source,
        () => {},
        () => {
          console.log(`Failed loading ${source}`);
          runInAction("[ACTION] Reverting original source", () => {
            this.resizeFailed = true;
          });
        }
      );
    }
  }

  @computed
  get source() {
    return this.sourceFrom();
  }

  render() {
    const { source, square, w, h, resizeMode, style } = this.props;

    const dimensions = _dimensions(square, w, h);
    const width = dimensions[0];
    const height = dimensions[1];

    // NOTE + TODO: Animated image is doing some really weird
    // thing to image. check onLoadStart, it's being called thousands of
    // times.

    return (width || height) && source && source.uri && this.source ? (
      <Image
        {...this.props}
        resizeMode={resizeMode}
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
