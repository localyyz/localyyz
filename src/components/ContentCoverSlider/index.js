import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// components
import { UppercasedText } from "localyyz/components";
import * as Animatable from "react-native-animatable";
import { Icon } from "react-native-elements";

// default fade height if not specified by prop on scroll
const FADE_HEIGHT = 50;
const POP_HEIGHT = Sizes.Height / 4;

export default class ContentCoverSlider extends React.Component {
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
    const y = event.nativeEvent.contentOffset.y;

    // toggle the statusbar style based on current opacity
    StatusBar.setBarStyle(
      y / (this.props.fadeHeight || FADE_HEIGHT) >= 0.25
        ? "light-content"
        : this.props.idleStatusBarStatus || "dark-content",
      true
    );

    // allow going back on swipe down
    y > -(this.props.popHeight || POP_HEIGHT)
      ? this.setState({ y: y })
      : this.props.backAction && this.props.backAction();
  }

  componentDidMount() {
    StatusBar.setBarStyle(this.props.idleStatusBarStatus || "dark-content");
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
          ]}
        />
      )
    );
  }

  render() {
    return (
      <View style={styles.container}>
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
                style={[
                  Styles.Text,
                  Styles.Terminal,
                  Styles.Alternate,
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
                ((this.props.fadeHeight || FADE_HEIGHT) - this.state.y) /
                (this.props.fadeHeight || FADE_HEIGHT)
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
            <Icon
              name={this.props.iconType || "arrow-back"}
              color={
                this.state.y / (this.props.fadeHeight || FADE_HEIGHT) >= 0.25
                  ? Colours.AlternateText
                  : this.props.backColor || Colours.AlternateText
              }
              onPress={this.props.backAction}
              underlayColor={Colours.Transparent}
              hitSlop={{
                top: Sizes.InnerFrame,
                bottom: Sizes.InnerFrame,
                left: Sizes.InnerFrame,
                right: Sizes.InnerFrame
              }}
            />
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
    marginTop: Sizes.OuterFrame * 2,
    marginBottom: Sizes.InnerFrame * 2,
    alignItems: "center",
    justifyContent: "center"
  },

  statusBarTitle: {
    alignItems: "center"
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
    top: Sizes.InnerFrame * 3,
    left: Sizes.InnerFrame,
    zIndex: 3
  }
});