import React from "react";
import { Animated, StyleSheet, Image, View } from "react-native";

import { Colours } from "~/src/constants";

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
  };

  render() {
    const { source, style, children, ...props } = this.props;
    const thumbnailSource = shopifyImageUrl(source.uri, "medium");

    return (
      <View style={styles.container}>
        <Animated.Image
          {...props}
          source={{ uri: thumbnailSource }}
          style={[style, { opacity: this.thumbnailAnimated }]}
          onLoad={this.handleThumbnailLoad}
          blurRadius={1}/>

        <Animated.Image
          {...props}
          source={source}
          style={[style, styles.overlay, { opacity: this.imageAnimated }]}
          onLoad={this.onImageLoad}/>

        {children && children.length > 0 ? (
          <View style={styles.overlay}>{children}</View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Background
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  }
});

const SHOPIFY_LIQUID = "cdn.shopify.com";

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
    : src;
}
