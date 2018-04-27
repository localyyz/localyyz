import React from "react";
import { View, StyleSheet, Keyboard } from "react-native";

// custom
import { Assistant, UppercasedText } from "localyyz/components";
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { BlurView } from "react-native-blur";
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
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  _keyboardDidShow = e => {
    this._view && this._view.transitionTo({ bottom: e.endCoordinates.height });
  };

  _keyboardDidHide = () => {
    this._view && this._view.transitionTo({ bottom: 0 });
  };

  get assistant() {
    return this.refs.assistant ? this.refs.assistant.wrappedInstance : {};
  }

  render() {
    return (
      <Animatable.View
        ref={ref => (this._view = ref)}
        animation={this.assistant.isBlocking ? "fadeIn" : null}
        delay={300}
        duration={500}
        style={[
          styles.container,
          !!this.props.lastUpdated
            && !!this.assistant.isBlocking && {
              top: 0
            }
        ]}>
        <View style={styles.blur}>
          {this.assistant.isVisible ? (
            <Animatable.View
              animation="fadeIn"
              delay={400}
              duration={400}
              style={styles.assistantHeader}>
              <UppercasedText style={styles.assistantLabel}>
                Localyyz Assistant
              </UppercasedText>
            </Animatable.View>
          ) : null}
          <Animatable.View
            animation="slideInUp"
            delay={800}
            duration={500}
            style={[
              styles.closedAssistantContainer,
              !!this.props.lastUpdated && !!this.assistant.isVisible
                ? styles.assistantContainer
                : null
            ]}>
            <Assistant
              ref="assistant"
              delay={800}
              typeSpeed={30}
              messages={this.props.messages.slice()}
              style={styles.assistant}/>
          </Animatable.View>
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
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

  assistantHeader: {
    paddingVertical: Sizes.InnerFrame / 3,
    paddingHorizontal: Sizes.OuterFrame,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: Colours.Transparent
  },

  assistantLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized
  },

  blur: {
    flex: 1,
    justifyContent: "flex-end"
  }
});
