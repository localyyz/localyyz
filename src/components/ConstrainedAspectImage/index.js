import React from "react";
import { Animated, Image } from "react-native";

export default class ConstrainedAspectImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null,
      failed: false
    };
  }

  componentDidMount() {
    if (this.props.source && this.props.source.uri) {
      Image.getSize(
        this.props.source.uri,
        (width, height) => {
          let ratio;
          // first, width constrain respecting aspect
          if (this.props.constrainWidth && width > this.props.constrainWidth) {
            ratio = height / width;
            width = this.props.constrainWidth;
            height = width * ratio;
          }

          // then, height constrain with new adjustments from above
          if (
            this.props.constrainHeight &&
            height > this.props.constrainHeight
          ) {
            ratio = width / height;
            height = this.props.constrainHeight;
            width = height * ratio;
          }

          // and now, set to rerender
          this.setState({
            width: width,
            height: height
          });
        },
        err => {
          this.setState(
            {
              failed: true
            },
            () =>
              console.log(
                `Image failed to load: ${this.props.source &&
                  this.props.source.uri} (${err.message})`
              )
          );
        }
      );
    }
  }

  render() {
    return (
      !this.state.failed && (
        <Animated.Image
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
          ]}
        />
      )
    );
  }
}
