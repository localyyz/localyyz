import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Sizes } from "localyyz/constants";

// custom
import AssistantMessage from "./components/Message.js";

// third party
import { computed } from "mobx";
import { inject } from "mobx-react";

// constants
const DEFAULT_TYPE_TIME = 120;
const TYPE_DELAY = 1000;

@inject("assistantStore")
export default class Assistant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      numManualMessages: 0
    };

    this.store = this.props.assistantStore;
    this._bubbleheights = [];
    this._timedMessages = {};

    // bindings
    this.write = this.write.bind(this);
    this.dequeue = this.dequeue.bind(this);
    this.dequeueAll = this.dequeueAll.bind(this);
    this.clearTimedMessage = this.clearTimedMessage.bind(this);
  }

  componentDidMount() {
    this.dequeueAll(this.props.messages);
  }

  componentWillUnmount() {
    for (let timedMessage of Object.values(this._timedMessages)) {
      timedMessage && clearTimeout(timedMessage);
    }
  }

  UNSAFE_componentWillReceiveProps(next) {
    if (
      next.messages
      && next.messages.length > (this.props.messages || []).length
    ) {
      this.dequeueAll(next.messages);
    }
  }

  dequeueAll(queue) {
    this.dequeue(queue, null, length => {
      if (
        queue.length
        > this.state.messages.length + this.state.numManualMessages
      ) {
        setTimeout(
          () => this.dequeueAll(queue),
          getTypeTime(length, this.props.typeSpeed, this.props.delay || 0)
            + TYPE_DELAY
        );
      }
    });
  }

  dequeue(queue, message, cb) {
    if (message) {
      this.write(message, true, cb);
    } else if (
      queue.length
      > this.state.messages.length + this.state.numManualMessages
    ) {
      // dequeue first from prop list
      this.write(
        queue[this.state.messages.length + this.state.numManualMessages],
        null,
        cb
      );
    }
  }

  clearTimedMessage(message) {
    if (message.duration) {
      this._timedMessages[message.message] = setTimeout(() => {
        let messageIndex = this.state.messages.indexOf(message);
        if (messageIndex > -1) {
          // remove from display messages
          this.state.messages[messageIndex].expired = true;

          // remove from timedMessages
          this._timedMessages[message.message] = null;

          // update display
          this.store.ping();
          this.forceUpdate();
        }
      }, getTypeTime(message.message.length, this.props.typeSpeed, this.props.delay) + message.duration);

      // for manual cancellation
      return this._timedMessages[message.message];
    }
  }

  write(message, manual, cb) {
    this.setState(
      {
        messages: [...this.state.messages, message],
        numManualMessages: this.state.numManualMessages + manual ? 1 : 0
      },
      () => {
        this.store.ping();
        this.clearTimedMessage(message);
        cb
          && cb((message.message ? message.message.length : message.length) || 0);
      }
    );

    // for manual cancellation (expiring and removing from view)
    let cancel = () => {
      this.state.messages.find(m => m === message).expired = true;

      // remove auto cancel if present
      let timedMessageUnlistener = this._timedMessages[message.message];
      timedMessageUnlistener && clearTimeout(timedMessageUnlistener);
      this._timedMessages[message.message] = null;

      // update display
      this.store.ping();
      this.forceUpdate();
    };

    // give cancellation util in global assistant
    let globalMessage = this.store.messages.find(
      m => m.message === message.message
    );
    if (globalMessage) {
      globalMessage.cancel = cancel;
    }

    return cancel;
  }

  height(n) {
    return this._bubbleheights
      .slice(0, n || this._bubbleheights.length)
      .reduce((a, b) => a + b, 0);
  }

  get isVisible() {
    return this.state.messages.filter(message => !message.expired).length > 0;
  }

  @computed
  get isBlocking() {
    return (
      this.state.messages.filter(
        message => message.blockProgress && !message.expired
      ).length > 0
    );
  }

  render() {
    return (
      <View
        style={[styles.container, this.props.style]}
        onLayout={e => this.props.onLoad && this.props.onLoad(e)}>
        {this.state.messages.map((message, i) => (
          <Animated.View
            key={`assistant-${i}`}
            onLayout={e =>
              (this._bubbleheights[i] = e.nativeEvent.layout.height)
            }
            style={{
              opacity:
                this.props.animator
                && this.props.animator.interpolate({
                  inputRange: [
                    this.height() - this.height(i + 1),
                    this.height() * 2
                  ],
                  outputRange: [1, 0],
                  extrapolate: "clamp"
                })
            }}>
            <AssistantMessage
              delay={this.props.delay}
              getTypeTime={getTypeTime}
              typeSpeed={this.props.typeSpeed}
              message={message}/>
          </Animated.View>
        ))}
      </View>
    );
  }
}

function getTypeTime(length, speed, delay) {
  return (length || 0) * (speed || DEFAULT_TYPE_TIME) + (delay || 0);
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    paddingRight: Sizes.Width / 5
  }
});
