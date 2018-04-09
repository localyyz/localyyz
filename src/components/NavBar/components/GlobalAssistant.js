import React from "react";
import { StyleSheet } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// custom
import { Assistant, UppercasedText } from "localyyz/components";

// third party
import { inject, observer } from "mobx-react";
import { BlurView } from "react-native-blur";
import * as Animatable from "react-native-animatable";

@inject("assistantStore")
@observer
export default class GlobalAssistant extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.assistantStore;
  }

  get assistant() {
    return this.refs.assistant ? this.refs.assistant.wrappedInstance : {};
  }

  render() {
    return (
      <Animatable.View
        animation={this.assistant.isBlocking ? "fadeIn" : null}
        delay={300}
        duration={500}
        style={[
          styles.container,
          !!this.store.lastUpdated &&
            !!this.assistant.isBlocking && {
              top: 0
            }
        ]}>
        <BlurView style={styles.blur} blurType="light" blurAmount={5}>
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
              !!this.store.lastUpdated && !!this.assistant.isVisible
                ? styles.assistantContainer
                : null
            ]}>
            <Assistant
              ref="assistant"
              delay={800}
              typeSpeed={30}
              messages={this.store.messages.slice()}
              style={styles.assistant}
            />
          </Animatable.View>
        </BlurView>
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
