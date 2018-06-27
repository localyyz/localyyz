import React from "react";
import { View, StyleSheet, Animated } from "react-native";

// custom
import { ConstrainedAspectImage } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

// constants
const ZOOM_AMOUNT = 0.2;

@inject(stores => ({
  scrollPosition: stores.homeStore.scrollAnimate,
  blocks: stores.homeStore.blocks
}))
@observer
export default class ParallaxPhoto extends React.Component {
  static propTypes = {
    scrollPosition: PropTypes.object.isRequired,
    startFrom: PropTypes.number
  };

  static defaultProps = {
    startFrom: 0
  };

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      photoHeight: 0
    };

    // bindings
    this.increasePhotoHeight = this.increasePhotoHeight.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  increasePhotoHeight({ nativeEvent: { layout: { height: photoHeight } } }) {
    console.log("fuck fuck", photoHeight);
    photoHeight > this.state.photoHeight
      && this._isMounted
      && this.setState({ photoHeight: photoHeight });
  }

  get containerHeight() {
    return this.state.photoHeight - this.state.photoHeight * (ZOOM_AMOUNT / 2);
  }

  render() {
    let containerHeight = this.containerHeight;
    let position = this.props.blocks[this.props.id]._position || 0;
    let inputRange = [
      position - containerHeight / 3 - this.props.startFrom,
      position + containerHeight - this.props.startFrom,
      position + containerHeight * 2 - this.props.startFrom
    ];

    // outputs for animations
    let outputRangeParallax = [
      -containerHeight * (ZOOM_AMOUNT / 3),
      containerHeight * ZOOM_AMOUNT,
      containerHeight * ZOOM_AMOUNT * 1.5
    ];
    let outputRangeSecondaryParallax = [
      0,
      containerHeight,
      containerHeight * 2
    ];
    let outputRangeFade = [1, 0, 0];

    let style = {
      marginLeft: -this.props.constrainWidth * (ZOOM_AMOUNT / 2),
      opacity: this.props.scrollPosition.interpolate({
        inputRange: inputRange,
        outputRange: outputRangeFade,
        extrapolate: "clamp"
      })
    };
    let parallaxStyle = {};
    parallaxStyle.transform = [
      {
        translateY: this.props.scrollPosition.interpolate({
          inputRange: inputRange,
          outputRange: outputRangeParallax,
          extrapolate: "clamp"
        })
      }
    ];

    return (
      <View
        ref="photo"
        style={[
          styles.container,
          { width: this.props.constrainWidth, height: containerHeight }
        ]}>
        <Animated.View style={[style, parallaxStyle]}>
          <ConstrainedAspectImage
            shouldPinWidth
            constrainWidth={this.props.constrainWidth * (1 + ZOOM_AMOUNT)}
            sourceWidth={this.props.sourceWidth}
            sourceHeight={this.props.sourceHeight}
            source={this.props.source}
            onLayout={this.increasePhotoHeight}/>
        </Animated.View>
        <Animated.View
          style={[
            styles.content,
            {
              width: this.props.constrainWidth,
              height: containerHeight,
              top: this.props.scrollPosition.interpolate({
                inputRange: inputRange,
                outputRange: outputRangeSecondaryParallax,
                extrapolate: "clamp"
              })
            }
          ]}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { overflow: "hidden" },

  content: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
