import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
import AssistantDots from "./Dots";

// third party
import * as Animatable from "react-native-animatable";

// constants
const FADE_DURATION = 500;

export default class AssistantMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      visible: true
    };

    this._typer = null;
    this._fader = null;
  }

  componentDidMount() {
    this._typer = setTimeout(
      () =>
        this.setState({
          ready: true
        }),
      this.props.getTypeTime
        ? this.props.getTypeTime(
            (this.props.message.message && this.props.message.message.length)
              || this.props.message.length,
            this.props.typeSpeed,
            this.props.delay
          )
        : ((this.props.message.message && this.props.message.message.length)
            || this.props.message.length
            || 0)
            * (this.props.typeSpeed || 100)
          + (this.props.delay || 0)
    );
  }

  componentWillUnmount() {
    clearTimeout(this._typer);
    clearTimeout(this._fader);
  }

  UNSAFE_componentWillReceiveProps(next) {
    if (next.message && next.message.expired && this.state.visible) {
      this._fader = setTimeout(
        () =>
          this.setState({
            visible: false
          }),
        FADE_DURATION
      );
    }
  }

  render() {
    return (
      this.state.visible
      && (this.state.ready ? (
        <Animatable.View
          animation={
            this.props.message && !this.props.message.expired
              ? "fadeIn"
              : "fadeOut"
          }
          duration={FADE_DURATION}>
          <View style={styles.shadow}>
            <View style={styles.chatBubble}>
              <Text style={styles.chatMessage}>
                {this.props.message.message || this.props.message}
              </Text>
            </View>
          </View>
        </Animatable.View>
      ) : (
        <AssistantDots />
      ))
    );
  }
}

const styles = StyleSheet.create({
  chatBubble: {
    marginHorizontal: Sizes.InnerFrame / 2,
    marginVertical: Sizes.InnerFrame / 10,
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.OuterFrame / 2,
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.Secondary,
    shadowColor: Colours.DarkTransparent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.2
  },

  chatMessage: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Alternate
  }
});
