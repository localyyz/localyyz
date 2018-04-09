import React from "react";
import { View, StyleSheet } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

const NUM_DOTS = 3;

// third party
import * as Animatable from "react-native-animatable";

export default class AssistantDots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    };
    this._updater = null;

    // bindings
    this.progress = this.progress.bind(this);
  }

  componentDidMount() {
    this.progress();
  }

  componentWillUnmount() {
    this._updater && clearTimeout(this._updater);
  }

  progress() {
    this._updater = setTimeout(
      () =>
        this.setState(
          {
            current: (this.state.current + 1) % NUM_DOTS
          },
          this.progress
        ),
      150
    );
  }

  render() {
    return (
      <Animatable.View
        animation="pulse"
        duration={400}
        easing="ease-out"
        iterationCount="infinite"
        style={styles.container}>
        {new Array(NUM_DOTS).fill().map((e, i) => (
          <View
            key={`dot-${i}`}
            style={[
              styles.dot,
              this.state.current === i && {
                backgroundColor: Colours.SubduedText
              }
            ]}
          />
        ))}
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    marginHorizontal: Sizes.InnerFrame / 2,
    marginVertical: Sizes.InnerFrame / 10,
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.OuterFrame / 2,
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: Sizes.InnerFrame / 8,
    backgroundColor: Colours.DarkTransparent
  }
});
