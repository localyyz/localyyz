import React from "react";
import { StyleSheet, Animated, Image, View } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { navLogo } from "localyyz/assets";
import { Assistant } from "localyyz/components";

// third party
import { observer, inject } from "mobx-react";

const AssistentHeaderGreeting = name => `Welcome back${name}!`;
const AssistentHeaderHelp = "I'm here to help you find something cool today ✨";

@inject(stores => ({
  avatarUrl: stores.userStore.avatarUrl,
  name: stores.userStore.name,
  position: stores.homeStore.scrollAnimate
}))
@observer
export default class AssistantHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      headerAssistantHeight: 1,
      headerWelcomeHeight: 0
    };
  }

  get headerContentHeight() {
    return (
      this.state.headerAssistantHeight
      + this.state.headerWelcomeHeight
      + Sizes.OuterFrame
    );
  }

  render() {
    const { name, avatarUrl, position } = this.props;

    return (
      <Animated.View
        style={[
          styles.headerContent,
          {
            height: position.interpolate({
              inputRange: [0, Sizes.Height / 4, Sizes.Height / 2],
              outputRange: [
                this.headerContentHeight,
                this.headerContentHeight / 2,
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
            onLayout={e =>
              this.state.headerWelcomeHeight
              || this.setState({
                headerWelcomeHeight: e.nativeEvent.layout.height
              })
            }>
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
            AssistentHeaderGreeting(
              name && name.length > 0 ? `, ${name.split(" ")[0]}` : ""
            ),
            AssistentHeaderHelp
          ]}
          onLoad={e =>
            this.setState({
              headerAssistantHeight: e.nativeEvent.layout.height
            })
          }/>
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
