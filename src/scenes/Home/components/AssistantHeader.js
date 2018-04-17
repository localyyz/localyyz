import React from "react";
import { StyleSheet, Animated, Image, View } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { navLogo } from "localyyz/assets";
import { Assistant } from "localyyz/components";

// third party
import { action, observable, computed, reaction } from "mobx";
import { observer, inject } from "mobx-react";

const AssistantHeaderGreeting = name => `Welcome back${name}!`;
const AssistantHeaderHelp = "I'm here to help you find something cool today ✨";

@inject(stores => ({
  avatarUrl: stores.userStore.avatarUrl,
  name: stores.userStore.name,
  position: stores.homeStore.scrollAnimate
}))
@observer
export default class AssistantHeader extends React.Component {
  @observable headerAssistantHeight = 1;
  @observable headerWelcomeHeight = 0;

  constructor(props) {
    super(props);
    this._lastMaxHeaderHeight = this.headerContentHeight;
  }

  @action
  setHeaderAssistantHeight = e => {
    this.headerAssistantHeight = e.nativeEvent.layout.height;
  };

  @action
  setHeaderWelcomeHeight = e => {
    this.headerWelcomeHeight = e.nativeEvent.layout.height;
  };

  reactHeaderContentHeight = reaction(
    () => this.headerContentHeight,
    height => {
      if (height > this._lastMaxHeaderHeight) {
        //TODO: unless number of assistant messages has changed
        this._lastMaxHeaderHeight = height;
      }
    }
  );

  @computed
  get headerContentHeight() {
    return (
      this.headerAssistantHeight + this.headerWelcomeHeight + Sizes.OuterFrame
    );
  }

  render() {
    const { name, avatarUrl, position } = this.props;

    return (
      <Animated.View
        style={[
          styles.headerContent,
          {
            // TODO: header animation output should be last maximum height (Paul thinks)
            height: position.interpolate({
              inputRange: [0, Sizes.Height / 4, Sizes.Height / 2],
              outputRange: [
                this._lastMaxHeaderHeight,
                this._lastMaxHeaderHeight / 2,
                0
              ],
              extrapolate: "clamp"
            })
          }
        ]}>
        <Animated.View
          style={{
            opacity: position.interpolate({
              inputRange: [
                this.headerContentHeight + 50,
                this.headerContentHeight + 150
              ],
              outputRange: [1, 0],
              extrapolate: "clamp"
            })
          }}>
          <View
            style={styles.splitWelcome}
            onLayout={this.setHeaderWelcomeHeight}>
            <Image style={styles.logo} source={navLogo} />
            <View
              style={[
                styles.avatarOutline,
                !avatarUrl && {
                  backgroundColor: Colours.Transparent
                }
              ]}>
              {!!avatarUrl && (
                <Image
                  style={styles.avatar}
                  source={{
                    uri: avatarUrl
                  }}/>
              )}
            </View>
          </View>
        </Animated.View>
        <Assistant
          animator={position}
          messages={[
            AssistantHeaderGreeting(
              name && name.length > 0 ? `, ${name.split(" ")[0]}` : ""
            ),
            AssistantHeaderHelp
          ]}
          onLoad={this.setHeaderAssistantHeight}/>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  headerContent: {
    overflow: "hidden"
  },

  splitWelcome: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginBottom: Sizes.InnerFrame * 8 / 10
  },

  avatarOutline: {
    alignItems: "center",
    justifyContent: "center",
    height: Sizes.Avatar,
    width: Sizes.Avatar,
    borderRadius: Sizes.Avatar / 2,
    backgroundColor: Colours.Foreground
  },

  avatar: {
    height: Sizes.Avatar * 0.9,
    width: Sizes.Avatar * 0.9,
    borderRadius: Sizes.Avatar * 0.9 / 2
  },

  logo: {
    tintColor: Colours.Foreground,
    height: 13,
    width: 90
  }
});
