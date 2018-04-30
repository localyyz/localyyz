import React from "react";
import { View, StyleSheet, Keyboard, Platform } from "react-native";

// custom
import { Assistant, BlurView } from "localyyz/components";
import { Colours, Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import * as Animatable from "react-native-animatable";

@inject(stores => ({
  lastUpdated: stores.assistantStore.lastUpdated,
  messages: stores.assistantStore.messages.slice()
}))
@observer
export default class GlobalAssistant extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.assistantStore;
  }
  static propTypes = {
    lastUpdated: PropTypes.any,
    messages: PropTypes.array
  };

  static defaultProps = {
    messages: []
  };

  componentDidMount() {
    // only adjust on keyboard on ios since android auto adjusts
    if (Platform.OS === "ios") {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        evt =>
          this.refs.container
          && this.refs.container.transitionTo({
            bottom: evt.endCoordinates.height
          })
      );

      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () =>
          this.refs.container
          && this.refs.container.transitionTo({
            bottom: 0
          })
      );
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }

  get assistant() {
    return this.refs.assistant ? this.refs.assistant.wrappedInstance : {};
  }

  get shouldShow() {
    return !!this.props.lastUpdated && !!this.assistant.isVisible;
  }

  get shouldBlock() {
    return this.shouldShow && !!this.assistant.isBlocking;
  }

  render() {
    return (
      <Animatable.View
        ref="container"
        pointerEvents="box-none"
        style={styles.container}>
        {this.shouldBlock ? (
          <BlurView
            blurType="light"
            blurAmount={5}
            style={styles.blur}
            pointerEvents="auto"/>
        ) : (
          <View style={styles.blur} pointerEvents="none" />
        )}
        <Animatable.View
          animation="slideInUp"
          delay={800}
          duration={500}
          style={[
            styles.closedAssistantContainer,
            this.shouldShow ? styles.assistantContainer : null
          ]}>
          <Assistant
            ref="assistant"
            delay={800}
            typeSpeed={30}
            messages={this.props.messages.slice()}
            style={styles.assistant}/>
        </Animatable.View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  },

  closedAssistantContainer: {
    height: 0,
    overflow: "hidden"
  },

  assistantContainer: {
    height: null,
    overflow: null,
    paddingVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame,
    backgroundColor: Colours.MenuBackground
  },

  assistant: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingRight: Sizes.Width / 6
  },

  blur: {
    flex: 1
  }
});
