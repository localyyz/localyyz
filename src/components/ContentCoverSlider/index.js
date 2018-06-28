import React from "react";
import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// components
import { UppercasedText, SloppyView } from "localyyz/components";
import * as Animatable from "react-native-animatable";
import { Icon } from "react-native-elements";

// local
import Store from "./store";

// default fade height if not specified by prop on scroll
const FADE_HEIGHT = 50;
const POP_HEIGHT = Sizes.Height / 4;

// NOTE: there's an issue with setState after component is unmounted
//  here we throttle the speed to navigate back to 200ms
const RECOMMENDED_BROWSING_SPEED = 0;

// NOTE: there's also an issue with scrollviews not rendering photos, so
// allows hack to work without making the header visible on load
const SCROLL_OFFSET = 1;

export default class ContentCoverSlider extends React.Component {
  static createStore() {
    return new Store();
  }

  constructor(props) {
    super(props);
    this.state = {
      y: 0
    };

    // bindings
    this.onScroll = this.onScroll.bind(this);
    this.renderBackground = this.renderBackground.bind(this);
  }

  onScroll(event) {
    const y = event.nativeEvent.contentOffset.y - SCROLL_OFFSET;

    // allow going back on swipe down
    y > -(this.props.popHeight || POP_HEIGHT)
      ? this.setState({ y: y })
      : this.props.backAction && this.props.backAction();
  }

  renderBackground() {
    return (
      this.props.background || (
        <View
          style={[
            styles.cover,
            this.props.backgroundColor && {
              backgroundColor: this.props.backgroundColor
            },
            this.props.backgroundHeight && {
              height: this.props.backgroundHeight
            }
          ]}/>
      )
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={
            this.state.y / (this.props.fadeHeight || FADE_HEIGHT) >= 0.25
              ? "light-content"
              : this.props.idleStatusBarStatus || "dark-content"
          }/>
        <View
          style={[
            styles.statusBar,
            {
              opacity: this.state.y / (this.props.fadeHeight || FADE_HEIGHT)
            }
          ]}>
          <View style={styles.statusBarContent}>
            <View style={styles.statusBarTitle}>
              <UppercasedText
                numberOfLines={1}
                style={[
                  styles.statusBarTitleLabel,
                  {
                    opacity:
                      this.state.y / (this.props.fadeHeight || FADE_HEIGHT)
                  }
                ]}>
                {this.props.title || ""}
              </UppercasedText>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.background,
            {
              opacity:
                ((this.props.fadeHeight || FADE_HEIGHT) - this.state.y)
                / (this.props.fadeHeight || FADE_HEIGHT)
            }
          ]}>
          {this.renderBackground()}
        </View>

        <Animatable.View
          ref="slider"
          animation="slideInUp"
          duration={500}
          delay={200}
          style={styles.content}>
          {this.props.children}
        </Animatable.View>

        {this.props.backAction != false && (
          <Animatable.View animation="bounceIn" delay={200} style={styles.back}>
            <TouchableOpacity
              onPress={() => {
                // NOTE: read comments on RECOMMENDED_BROWSING_SPEED
                // for clarification on why this is needed
                this.props.backActionThrottle
                  ? setTimeout(() => {
                      this.props.backAction();
                    }, RECOMMENDED_BROWSING_SPEED)
                  : this.props.backAction();
              }}>
              <SloppyView>
                <Icon
                  name={this.props.iconType || "arrow-back"}
                  size={Sizes.NavLeft}
                  color={
                    this.state.y / (this.props.fadeHeight || FADE_HEIGHT)
                    >= 0.25
                      ? Colours.AlternateText
                      : this.props.backColor || Colours.AlternateText
                  }
                  onPress={() => {
                    // NOTE: read comments on RECOMMENDED_BROWSING_SPEED
                    // for clarification on why this is needed
                    this.props.backActionThrottle
                      ? setTimeout(() => {
                          this.props.backAction();
                        }, RECOMMENDED_BROWSING_SPEED)
                      : this.props.backAction();
                  }}
                  underlayColor={Colours.Transparent}/>
              </SloppyView>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  statusBar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: Colours.StatusBar,
    zIndex: 2
  },

  statusBarContent: {
    flexDirection: "row",
    marginTop: Sizes.ScreenTop,
    marginBottom: Sizes.InnerFrame,
    alignItems: "center",
    justifyContent: "center"
  },

  statusBarTitle: {
    alignItems: "center",
    paddingHorizontal: Sizes.OuterFrame * 2
  },

  statusBarTitleLabel: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Alternate
  },

  background: {
    flex: 1
  },

  cover: {
    height: 200,
    backgroundColor: Colours.MenuBackground
  },

  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  back: {
    position: "absolute",
    top: Sizes.ScreenTop - 0.1,
    left: Sizes.InnerFrame,
    zIndex: 3
  }
});
