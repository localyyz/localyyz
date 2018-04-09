import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Keyboard
} from "react-native";
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import { ifIphoneX } from "react-native-iphone-x-helper";

// pullup snappers (all numbers from the top)
export const PULLUP_FULL_SPAN = Sizes.InnerFrame * 4;
export const PULLUP_HALF_SPAN = Sizes.Height / 2;
export const PULLUP_LOW_SPAN = Sizes.Height - Sizes.InnerFrame * 8;

export default class Pullup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: props.isVisible || false,
      isUpward: true,

      // current height, always updated on touch
      pullupHeight: PULLUP_LOW_SPAN,
      keyboardHeight: 0,
      touchOffset: null,

      // snap height, updated only on touch release
      closest: PULLUP_LOW_SPAN
    };

    // bindings
    this._toggle = this._toggle.bind(this);
    this._onKeyboardUpdate = this._onKeyboardUpdate.bind(this);
    this.snap = this.snap.bind(this);
  }

  UNSAFE_componentWillReceiveProps(next) {
    // toggle visibility change
    if (next.isVisible != this.props.isVisible) {
      this._toggle(next.isVisible);
    }
  }

  UNSAFE_componentWillMount() {
    // keyboard handling
    this.keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._onKeyboardUpdate
    );
    this.keyboardHideListener = Keyboard.addListener("keyboardDidHide", evt =>
      this._onKeyboardUpdate(evt, "hide")
    );

    // expansion and snapping of pullup
    this._pr = PanResponder.create({
      onStartShouldSetPanResponder: (e, state) => true,
      onMoveShouldSetPanResponder: (e, state) => state.dy !== 0,
      onPanResponderMove: (e, state) => {
        // force store to update ui on cartItems
        // TODO: kinda hacky, but due to convoluted setup of pullup + cart
        // + navbar in an attempt to maintain solid
        this.props.onPull &&
          this.props.onPull(
            _closestSnap(
              [PULLUP_FULL_SPAN, PULLUP_HALF_SPAN, PULLUP_LOW_SPAN],
              e.nativeEvent.pageY
            )
          );

        const offset = e.nativeEvent.locationY - this.props.navBarHeight;
        this.setState({
          touchOffset: this.state.touchOffset || offset,
          pullupHeight: _getTopDistance(e, this.state.touchOffset || offset),
          isUpward: _isUpward(state),
          closest: _closestSnap(
            [PULLUP_FULL_SPAN, PULLUP_HALF_SPAN, PULLUP_LOW_SPAN],
            e.nativeEvent.pageY
          )
        });
      },

      // snapping
      onPanResponderTerminationRequest: (e, state) => false,
      onPanResponderRelease: (e, state) => {
        // get closest snap height
        let snapHeight = _closestSnap(
          [PULLUP_FULL_SPAN, PULLUP_HALF_SPAN, PULLUP_LOW_SPAN],
          e.nativeEvent.pageY
        );

        if (
          !this.state.isUpward &&
          snapHeight === PULLUP_LOW_SPAN &&
          _getTopDistance(e, this.state.touchOffset) >
            PULLUP_LOW_SPAN + Sizes.OuterFrame * 2
        ) {
          // hide nav bar
          this.props.toggle && this.props.toggle();
        } else {
          // set snap to a particular guide
          this.snap(snapHeight);
        }

        // reset offset
        this.setState({
          touchOffset: null
        });
      }
    });
  }

  componentWillUnmount() {
    this.keyboardShowListener && this.keyboardShowListener.remove();
    this.keyboardHideListener && this.keyboardHideListener.remove();
  }

  _onKeyboardUpdate(evt, type = "show") {
    this.setState({
      keyboardHeight: type == "show" ? evt.endCoordinates.height || 0 : 0
    });
  }

  // this should never be called directly, but handled by a prop update
  // from parent, triggered via componentWillReceiveProps
  _toggle(isVisible) {
    this.setState(
      {
        isVisible: isVisible,

        // reset height since closed
        pullupHeight: PULLUP_LOW_SPAN,
        closest: PULLUP_LOW_SPAN
      },
      this.state.isVisible ? this.props.onClose : this.props.onOpen
    );

    // chaining
    return true;
  }

  snap(height, onlyGrow) {
    // constants instead of actual number
    if (typeof height !== "number") {
      height =
        {
          low: PULLUP_LOW_SPAN,
          middle: PULLUP_HALF_SPAN,
          high: PULLUP_FULL_SPAN
        }[height] || PULLUP_FULL_SPAN;
    }

    // if onlyGrow is given, then only change height if it's
    // greater than current height
    if (!onlyGrow || height < this.state.pullupHeight) {
      this.setState(
        {
          pullupHeight: height,
          closest: height

          // trigger callback onSnap to do things like
          // scroll content up if minimizing
          // and show cart items if min-ing o/w use previous settings
        },
        () => this.props.onSnap && this.props.onSnap(this.state.pullupHeight)
      );
    }

    // chaining
    return true;
  }

  get content() {
    return this.refs.content;
  }

  get height() {
    return this.state.closest;
  }

  render() {
    // used to handle keyboard content coming into view
    const pullupHeight =
      Sizes.Height - this.state.keyboardHeight - this.state.pullupHeight <
        250 && this.state.keyboardHeight > 0
        ? PULLUP_FULL_SPAN
        : this.state.pullupHeight;

    return (
      <View>
        {this.state.isVisible && (
          <TouchableWithoutFeedback
            onPress={() => {
              // close the pullup
              this.props.toggle && this.props.toggle(false);

              // and close callback
              this.props.onClose && this.props.onClose();
            }}
          >
            <Animatable.View
              animation="fadeIn"
              duration={200}
              delay={100}
              style={styles.overlay}
            >
              <TouchableWithoutFeedback>
                <Animatable.View
                  ref="pullup"
                  animation="slideInUp"
                  delay={500}
                  duration={200}
                  style={[
                    styles.pullupContainer,
                    {
                      top: pullupHeight
                    },
                    pullupHeight === PULLUP_FULL_SPAN &&
                      ifIphoneX(
                        {
                          paddingTop: Sizes.OuterFrame * 2
                        },
                        {}
                      )
                  ]}
                >
                  <View {...this._pr.panHandlers}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        // press to snap grow
                        if (this.state.pullupHeight >= PULLUP_LOW_SPAN) {
                          this.snap(PULLUP_HALF_SPAN, true) &&
                            this.props.onPull &&
                            this.props.onPull(PULLUP_HALF_SPAN);
                        } else if (
                          this.state.pullupHeight >= PULLUP_HALF_SPAN
                        ) {
                          this.snap(PULLUP_FULL_SPAN, true) &&
                            this.props.onPull &&
                            this.props.onPull(PULLUP_FULL_SPAN);
                        }
                      }}
                    >
                      <View
                        hitSlop={{
                          top: Sizes.InnerFrame,
                          bottom: Sizes.InnerFrame,
                          left: Sizes.InnerFrame,
                          right: Sizes.InnerFrame
                        }}
                        style={[
                          styles.pullIndicator,
                          pullupHeight === PULLUP_FULL_SPAN && {
                            // hide indicator when fully spanned
                            backgroundColor: Colours.Transparent
                          }
                        ]}
                      />
                    </TouchableWithoutFeedback>
                    {this.props.renderHeader}
                  </View>
                  <ScrollView
                    ref="content"
                    scrollEnabled={this.state.closest <= PULLUP_HALF_SPAN}
                  >
                    <View
                      style={{
                        paddingBottom: this.state.keyboardHeight
                      }}
                    >
                      {this.props.children ||
                        (this.props.renderContent &&
                          this.props.renderContent())}
                    </View>
                  </ScrollView>
                  {this.height < PULLUP_LOW_SPAN && (
                    <LinearGradient
                      colors={[Colours.Transparent, Colours.Foreground]}
                      style={styles.gradient}
                    />
                  )}
                </Animatable.View>
              </TouchableWithoutFeedback>
            </Animatable.View>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

function _getTopDistance(e, offset) {
  return e.nativeEvent.pageY - (offset || 0);
}

function _isUpward(state) {
  return state.y0 - state.moveY > 0;
}

function _closestSnap(snaps, y) {
  let i, closest;
  let minDiff = 999;

  for (i of snaps) {
    if (Math.abs(y - i) < minDiff) {
      minDiff = Math.abs(y - i);
      closest = i;
    }
  }

  return closest;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0
  },

  overlay: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    height: Sizes.Height,
    backgroundColor: Colours.DarkTransparent
  },

  pullupContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: PULLUP_LOW_SPAN,
    backgroundColor: Colours.Foreground
  },

  pullIndicator: {
    alignSelf: "center",
    height: Sizes.InnerFrame / 3,
    width: Sizes.OuterFrame * 2,
    borderRadius: Sizes.InnerFrame / 3,
    backgroundColor: Colours.MenuBackground,
    marginVertical: Sizes.InnerFrame / 2 + 2
  },

  // requires height inline
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Sizes.OuterFrame * 2
  }
});
