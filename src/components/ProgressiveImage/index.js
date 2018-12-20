import React from "react";
import { Animated, StyleSheet, Image, View } from "react-native";

export default class ProgressiveImage extends React.Component {
  static propTypes = {
    ...Image.propTypes
  };

  static defaultProps = {
    ...Image.defaultProps
  };

  constructor(props) {
    super(props);

    this.thumbnailAnimated = new Animated.Value(0);
    this.imageAnimated = new Animated.Value(0);
  }

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1
    }).start();
  };

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1
    }).start();
    this.props.onLoad && this.props.onLoad();
  };

  render() {
    const { source, style, children, ...props } = this.props;
    const thumbnailSource = parseImageUrl(source.uri, "small");

    return (
      <View style={styles.container}>
        <Animated.Image
          {...props}
          source={{ uri: thumbnailSource }}
          style={[{ opacity: this.thumbnailAnimated }, style]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}/>

        <Animated.Image
          {...props}
          source={source}
          style={[styles.overlay, { opacity: this.imageAnimated }, style]}
          onLoad={this.onImageLoad}/>

        {children && children.length > 0 ? (
          <View style={styles.overlay}>{children}</View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
});

const SHOPIFY_LIQUID = "cdn.shopify.com";
const UNIQLO = "im.uniqlo.com";

const CDN_TYPES = {
  [SHOPIFY_LIQUID]: shopifyImageUrl,
  [UNIQLO]: uniqloImageUrl
};

function parseImageUrl(src, size) {
  for (let key in CDN_TYPES) {
    if (src.includes(key)) {
      return CDN_TYPES[key](src, size);
    }
  }
  return "";
}

function uniqloImageUrl(src, size) {
  // remove any current image size then add the new image size
  return src && src.includes(UNIQLO)
    ? src
        .replace(/_(small|large|middles)+\./gi, ".")
        .replace(/\.jpg|\.png|\.gif|\.jpeg/gi, function(match) {
          return "_" + size + match;
        })
    : "";
}

// via: https://gist.github.com/DanWebb/cce6ab34dd521fcac6ba
function shopifyImageUrl(src, size) {
  // remove any current image size then add the new image size
  return src && src.includes(SHOPIFY_LIQUID)
    ? src
        .replace(
          /_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./gi,
          "."
        )
        .replace(/\.jpg|\.png|\.gif|\.jpeg/gi, function(match) {
          return "_" + size + match;
        })
    : "";
}
