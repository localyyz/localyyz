import React from "react";
import { View, StyleSheet, Keyboard, Platform } from "react-native";

// custom
import { AssistantMessage } from "localyyz/components";
import { Colours, Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { inject, observer, PropTypes as mobxPropTypes } from "mobx-react";
import { queueProcessor } from "mobx-utils";
import { BlurView } from "react-native-blur";
import * as Animatable from "react-native-animatable";

@inject(stores => ({
  messages: stores.assistantStore.messages,
  write: stores.assistantStore.write
}))
@observer
export default class GlobalAssistant extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.startWorker();

    this._keyboardHeight = 0;
  }
  static propTypes = {
    messages: mobxPropTypes.arrayOrObservableArray,
    write: PropTypes.func
  };

  static defaultProps = {
    messages: []
  };

  componentDidMount() {
    // only adjust on keyboard on ios since android auto adjusts
    if (Platform.OS === "ios") {
      this.keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        evt => {
          this._keyboardHeight = evt.endCoordinates.height;
          this.refs.container
            && this.refs.container.transitionTo({
              bottom: evt.endCoordinates.height
            });
        }
      );

      this.keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          this._keyboardHeight = 0;
          this.refs.container
            && this.refs.container.transitionTo({
              bottom: 0
            });
        }
      );
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();

    this.state.timeout && clearTimeout(this.state.timeout);
    this.dispose();
  }

  startWorker = () => {
    this.dispose = queueProcessor(this.props.messages, msg => {
      // if there's already a message in progress...
      if (this.state.message && !msg.isCancel) {
        // stick it back into the message queue for later
        setTimeout(() => {
          this.props.write(msg.message, msg.duration, msg.blockProgress);
        }, 1000);
      } else if (msg.isCancel && msg.message == this.state.message) {
        clearTimeout(this.state.timeout);
        this.setState({
          message: null
        });
      } else {
        this.setState({
          message: msg,
          timeouts: setTimeout(() => {
            this.setState({
              message: null
            });
          }, msg.duration)
        });
      }
    });
  };

  render() {
    return this.state.message ? (
      <Animatable.View
        ref="container"
        pointerEvents="box-none"
        style={[styles.container, { bottom: this._keyboardHeight }]}>
        {this.state.message.blockProgress ? (
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
            (styles.assistantContainer: null)
          ]}>
          <View
            style={[
              {
                alignItems: "flex-start",
                paddingRight: Sizes.Width / 5
              },
              styles.assistant
            ]}>
            <AssistantMessage
              delay={0}
              getTypeTime={getTypeTime}
              typeSpeed={30}
              message={this.state.message}/>
          </View>
        </Animatable.View>
      </Animatable.View>
    ) : null;
  }
}

// constants
const DEFAULT_TYPE_TIME = 120;
function getTypeTime(length, speed, delay) {
  return (length || 0) * (speed || DEFAULT_TYPE_TIME) + (delay || 0);
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
