import React from "react";
import { View, Image, ImageBackground, PixelRatio } from "react-native";
import PropTypes from "prop-types";
import { Colours } from "localyyz/constants";

// constants
// turn this on to log all photos (lots of noise)
const DEBUG = false;

// set a specific image url to listen to
const DEBUG_IMAGE = "";

// this allows ConstrainedAspectImage to be used on non-shopify hosted images
const SHOPIFY_LIQUID = "cdn.shopify.com";

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
      _uri: this.props.source.uri,
      _width: this.props.constrainWidth,
      _height: this.props.constrainHeight,
      _isLoading: false,
      didFail: false
    };
  }

  get aspectImageUrl() {
    let constrainWidth = this.props.constrainWidth
      ? PixelRatio.roundToNearestPixel(this.props.constrainWidth)
      : null;
    let constrainHeight = this.props.constrainHeight
      ? PixelRatio.roundToNearestPixel(this.props.constrainHeight)
      : null;

    return imgUrl(
      this.props.source.uri,
      `${constrainWidth ? constrainWidth * PixelRatio.get() : ""}x${
        constrainHeight ? constrainHeight * PixelRatio.get() : ""
      }`
    );
  }

  get width() {
    return this.state._width || this.props.constrainWidth;
  }

  get height() {
    return this.state._height || this.props.constrainHeight;
  }

  get isReady() {
    return !!this.width && !!this.height;
  }

  get baseComponent() {
    return this.props.children ? ImageBackground : Image;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {
      _uri:
        nextProps.source.uri !== prevState._uri
          ? nextProps.source.uri
          : prevState._uri,
      _width: nextProps.source.uri !== prevState._uri ? null : prevState._width,
      _height:
        nextProps.source.uri !== prevState._uri ? null : prevState._height
    };
    return newState;
  }

  componentDidMount() {
    (DEBUG || this.props.source.uri === DEBUG_IMAGE)
      && console.log(
        "CONSTRAINTS",
        this.props.constrainWidth,
        this.props.constrainHeight
      );

    this.componentDidUpdate();
  }

  componentDidUpdate() {
    (DEBUG || this.props.source.uri === DEBUG_IMAGE)
      && console.log(
        this.props.source.uri,
        "RESOLVED AS",
        this.aspectImageUrl,
        "DID UPDATE, WILL FETCH SIZES",
        !this.isReady && !this.state._isLoading
      );

    !this.isReady
      && !this.state._isLoading
      && this.setState({ _isLoading: true }, () =>
        Image.getSize(this.aspectImageUrl, (width, height) => {
          let scaledWidth;
          let scaledHeight;

          // convert back to layout sizing
          (DEBUG || this.props.source.uri === DEBUG_IMAGE)
            && console.log("SIZE FETCH RESOLVED", width, height);
          scaledWidth = PixelRatio.roundToNearestPixel(
            width / PixelRatio.get()
          );
          scaledHeight = PixelRatio.roundToNearestPixel(
            height / PixelRatio.get()
          );

          (DEBUG || this.props.source.uri === DEBUG_IMAGE)
            && console.log("SCALED DOWN TO", scaledWidth, scaledHeight);

          // handle returned image being smaller than needed scaled constraint
          if (scaledWidth < this.width || scaledHeight < this.height) {
            let ratio;

            // first, width constrain respecting aspect
            if (this.width && width > this.width) {
              ratio = height / width;
              scaledWidth = this.width;
              scaledHeight = scaledWidth * ratio;
            }

            // then, height constrain with new adjustments from above
            if (this.height && height > this.height) {
              ratio = width / height;
              scaledHeight = this.height;
              scaledWidth = scaledHeight * ratio;
            }

            (DEBUG || this.props.source.uri === DEBUG_IMAGE)
              && console.log(
                "SCALED DOWN IS TOO LOW RES, CONVERTED TO",
                scaledWidth,
                scaledHeight
              );
          }

          // TODO: handle unmounted component
          this.setState({
            _width: scaledWidth,
            _height: scaledHeight,
            _isLoading: false
          });
        })
      );
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate
      // change in state
      = (nextState !== this.state
        // require both width and height to be set
        && nextState._width
        && nextState._height
        // require either change in width or height
        && (nextState._width !== this.state._width
          || nextState._height !== this.state._height))
      // change in props
      || (nextProps.constrainWidth !== this.props.constrainWidth
        || nextProps.constrainHeight !== this.props.constrainHeight
        || nextProps.source.uri !== this.props.source.uri)
      // or failed, show grey
      || nextState.didFail !== this.state.didFail;

    (DEBUG || nextProps.source.uri === DEBUG_IMAGE)
      && (nextProps.constrainWidth !== this.props.constrainWidth
        && console.log(
          "CONSTRAINT WIDTH CHANGE FROM",
          this.props.constrainWidth,
          "TO",
          nextProps.constrainWidth
        ));

    (DEBUG || this.props.source.uri === DEBUG_IMAGE)
      && console.log("SHOULD UPDATE", shouldUpdate);
    return shouldUpdate;
  }

  render() {
    (DEBUG || this.props.source.uri === DEBUG_IMAGE)
      && console.log(
        "RENDER, ACTUALLY SHOWING",
        this.isReady,
        "WITH SIZES",
        this.width,
        this.height
      );

    return (
      <View
        style={{
          backgroundColor:
            this.state._isLoading || this.state.didFail
              ? Colours.Background
              : Colours.Transparent,
          width: this.width,
          height: this.height,
          overflow: "hidden"
        }}>
        {this.isReady ? (
          <this.baseComponent
            {...this.props}
            source={{
              uri: this.aspectImageUrl
            }}
            resizeMode="contain"
            onError={({ nativeEvent: { error } }) => {
              if (error) {
                console.log(`ConstrainedAspectImage: ${error}`);
                this.setState({ didFail: true });
              }
            }}
            style={[
              ...(this.props.style || []),
              {
                width: this.width,
                height: this.height
              }
            ]}/>
        ) : null}
      </View>
    );
  }
}

// via: https://gist.github.com/DanWebb/cce6ab34dd521fcac6ba
function imgUrl(src, size) {
  // remove any current image size then add the new image size
  return src.includes(SHOPIFY_LIQUID)
    ? src
        .replace(
          /_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g,
          "."
        )
        .replace(/\.jpg|\.png|\.gif|\.jpeg/g, function(match) {
          return "_" + size + match;
        })
    : src;
}
