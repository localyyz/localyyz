import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text
} from "react-native";

// third party
import LinearGradient from "react-native-linear-gradient";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import {
  UppercasedText,
  SloppyView,
  ConstrainedAspectImage
} from "localyyz/components";
import * as Animatable from "react-native-animatable";
import { Icon } from "react-native-elements";

// local
import Store from "./store";

// default fade height if not specified by prop on scroll
const FADE_HEIGHT = 50;
const POP_HEIGHT = Sizes.Height / 4;

// NOTE: there's also an issue with scrollviews not rendering photos, so
// allows hack to work without making the header visible on load
const SCROLL_OFFSET = 1;

// manually synced with top status bar to avoid onLayout
const STATUS_BAR_HEIGHT = 30 + Sizes.ScreenTop;

export class Header extends React.Component {
  get headerComponent() {
    return this.props.image ? ConstrainedAspectImage : View;
  }

  render() {
    let image = this.props.image || {};
    return (
      <this.headerComponent
        source={{ uri: image.imageUrl }}
        constrainWidth={Sizes.Width}
        sourceWidth={image.width}
        sourceHeight={image.height}>
        <View style={image.imageUrl && styles.builtInHeader}>
          <LinearGradient
            colors={[
              image.imageUrl
                ? this.props.backgroundColor || Colours.Foreground
                : Colours.Transparent,
              image.imageUrl
                ? this.props.backgroundColor || Colours.Foreground
                : Colours.Transparent,
              image.imageUrl
                ? this.props.transparentBackgroundColor || Colours.Transparent
                : Colours.Transparent
            ]}
            start={{ y: 1, x: 0 }}
            end={{ y: 0, x: 0 }}
            style={styles.gradient}>
            <Text
              style={[
                styles.title,
                this.props.titleColor && { color: this.props.titleColor }
              ]}>
              {this.props.title}
            </Text>
            {this.props.description ? (
              <Text
                style={[
                  styles.description,
                  this.props.titleColor && { color: this.props.titleColor }
                ]}>
                {this.props.description}
              </Text>
            ) : null}
          </LinearGradient>
        </View>
      </this.headerComponent>
    );
  }
}

export default class ContentCoverSlider extends React.Component {
  static STATUS_BAR_HEIGHT = STATUS_BAR_HEIGHT;
  static Header = Header;

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
    y > -(this.props.popHeight || POP_HEIGHT) ? this.setState({ y: y }) : null; // this.props.backAction && this.props.backAction();
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
          <LinearGradient
            colors={[Colours.LightDarkShadow, Colours.BlackTransparent]}
            start={{ y: 0, x: 0 }}
            end={{ y: 1, x: 0 }}
            style={styles.back}
            pointerEvents="box-none">
            <Animatable.View
              animation="fadeIn"
              delay={200}
              style={styles.backButton}>
              <TouchableOpacity onPress={this.props.backAction}>
                <SloppyView
                  hitSlop={{
                    top: Sizes.InnerFrame * 2,
                    bottom: Sizes.InnerFrame * 2,
                    left: Sizes.InnerFrame * 2,
                    right: Sizes.InnerFrame * 2
                  }}>
                  <Icon
                    name={this.props.iconType || "arrow-back"}
                    size={Sizes.NavLeft}
                    color={
                      this.state.y / (this.props.fadeHeight || FADE_HEIGHT)
                      >= 0.25
                        ? Colours.AlternateText
                        : this.props.backColor || Colours.AlternateText
                    }
                    onPress={this.props.backAction}
                    underlayColor={Colours.Transparent}/>
                </SloppyView>
              </TouchableOpacity>
            </Animatable.View>
          </LinearGradient>
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
    paddingHorizontal: Sizes.OuterFrame * 3
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
    top: 0,
    left: 0,
    right: 0,
    height: Sizes.Height / 4,
    zIndex: 3
  },

  backButton: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: Sizes.ScreenTop - 0.1,
    marginLeft: Sizes.InnerFrame
  },

  // header
  title: {
    ...Styles.Text,
    ...Styles.Title
  },

  description: {
    ...Styles.Text,
    marginTop: Sizes.InnerFrame / 2
  },

  builtInHeader: {
    flex: 1,
    justifyContent: "flex-end"
  },

  gradient: {
    paddingTop: Sizes.OuterFrame * 3,
    paddingHorizontal: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  }
});
