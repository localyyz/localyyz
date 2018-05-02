import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Keyboard
} from "react-native";
import { Colours, Sizes } from "localyyz/constants";
import PropTypes from "prop-types";

// third party
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { observer, inject } from "mobx-react";

// pullup snappers (all numbers from the top)
export const PULLUP_FULL_SPAN = Sizes.InnerFrame * 6;
export const PULLUP_HALF_SPAN = Sizes.Height / 2;
export const PULLUP_LOW_SPAN = Sizes.Height - Sizes.InnerFrame * 10;
export const HEIGHT_THRESHOLDS = [
  PULLUP_LOW_SPAN,
  PULLUP_HALF_SPAN,
  PULLUP_FULL_SPAN
];
export const HEIGHT_THRESHOLD_TYPES = HEIGHT_THRESHOLDS.reduce(
  (acc, e, i) => ({ ...acc, [e]: i }),
  {}
);

@inject(stores => ({
  isPullupVisible: stores.navbarStore.isPullupVisible,
  pullupHeight: stores.navbarStore.pullupHeight,
  pullupClosestHeight: stores.navbarStore.pullupClosestHeight,
  togglePullup: visible => stores.navbarStore.togglePullup(visible),
  setPullupHeight: (height, closest) =>
    stores.navbarStore.setPullupHeight(height, closest)
}))
@observer
export default class Pullup extends React.Component {
  static propTypes = {
    header: PropTypes.element,
    children: PropTypes.node,
    navBarHeight: PropTypes.number,
    onPull: PropTypes.func,
    onSnap: PropTypes.func,
    onClose: PropTypes.func,
    onHeightThresholdChange: PropTypes.func,

    // mobx injected
    isPullupVisible: PropTypes.bool,
    pullupHeight: PropTypes.number,
    pullupClosestHeight: PropTypes.number,
    togglePullup: PropTypes.func.isRequired,
    setPullupHeight: PropTypes.func.isRequired
  };

  static defaultProps = {
    navBarHeight: 0,
    isPullupVisible: false,
    pullupHeight: PULLUP_LOW_SPAN,
    pullupClosestHeight: PULLUP_LOW_SPAN
  };

  constructor(props) {
    super(props);
    this.state = {
      isUpward: true,

      // others
      keyboardHeight: 0,
      touchOffset: null
    };

    // bindings
    this.snap = this.snap.bind(this);
    this.close = this.close.bind(this);
    this._onKeyboardUpdate = this._onKeyboardUpdate.bind(this);
  }

  componentWillMount() {
    // keyboard handling
    this.keyboardShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._onKeyboardUpdate
    );
    this.keyboardHideListener = Keyboard.addListener("keyboardDidHide", e =>
      this._onKeyboardUpdate(e, "hide")
    );

    // expansion and snapping of pullup
    this._pr = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (e, state) => state.dy !== 0,
      onPanResponderMove: (e, state) => {
        // only register initial touch offset
        const offset
          = this.state.touchOffset
          || e.nativeEvent.locationY - this.props.navBarHeight;
        const closestThreshold = _closestSnap(
          HEIGHT_THRESHOLDS,
          e.nativeEvent.pageY
        );

        // onPull cb
        this.props.onPull && this.props.onPull(closestThreshold);

        // finally state
        const height = _getTopDistance(e, offset);
        this.setState(
          {
            touchOffset: offset,
            isUpward: _isUpward(state)
          },
          () => this.props.setPullupHeight(height, closestThreshold)
        );
      },

      // snapping
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: e => {
        // get closest snap height
        let snapThreshold = _closestSnap(
          HEIGHT_THRESHOLDS,
          e.nativeEvent.pageY
        );

        if (
          !this.state.isUpward
          && snapThreshold === PULLUP_LOW_SPAN
          && _getTopDistance(e, this.state.touchOffset)
            > PULLUP_LOW_SPAN + Sizes.OuterFrame * 2
        ) {
          // hide pullup since dropped below minimum threshold
          this.close();
        } else {
          // set snap to a particular guide
          this.snap(snapThreshold);
        }
      }
    });
  }

  componentWillUnmount() {
    this.keyboardShowListener && this.keyboardShowListener.remove();
    this.keyboardHideListener && this.keyboardHideListener.remove();
  }

  snap(height, onlyGrow, onCondition = true) {
    // if onlyGrow is given, then only change height if it's
    // greater than current height
    if ((!onlyGrow || height < this.props.pullupHeight) && onCondition) {
      this.setState(
        {
          // snapping concludes the touch event
          touchOffset: null

          // trigger callback onSnap to do things like
          // scroll content up if minimizing
          // and show cart items if min-ing o/w use previous settings
        },
        () => this.props.setPullupHeight(height, height)
      );
    }

    // chaining
    return true;
  }

  close() {
    this.snap(PULLUP_LOW_SPAN);
    this.props.togglePullup(false);
    this.props.onClose && this.props.onClose();
  }

  get content() {
    // fail silently if scrolling requested but not available
    return this.refs.content || { scrollTo: () => {} };
  }

  render() {
    return (
      <View style={styles.container} pointerEvents="box-none">
        {this.props.isPullupVisible ? (
          <TouchableWithoutFeedback onPress={this.close}>
            <Animatable.View
              animation="fadeIn"
              duration={400}
              delay={100}
              style={styles.overlay}>
              <TouchableWithoutFeedback>
                <Animatable.View
                  ref="pullup"
                  animation="slideInUp"
                  delay={300}
                  duration={200}
                  easing="ease-in"
                  pointerEvents="auto"
                  style={[
                    styles.pullupContainer,
                    {
                      top: this.props.pullupHeight
                    },
                    this.props.pullupHeight === PULLUP_FULL_SPAN
                      && ifIphoneX(
                        {
                          paddingTop: Sizes.OuterFrame * 2
                        },
                        {}
                      )
                  ]}>
                  <View {...this._pr.panHandlers} pointerEvents="auto">
                    <View
                      pointerEvents="auto"
                      style={[
                        styles.pullIndicator,
                        this.props.pullupHeight <= PULLUP_FULL_SPAN && {
                          // hide indicator when fully spanned
                          backgroundColor: Colours.Transparent
                        }
                      ]}/>
                    {this.props.header}
                  </View>
                  <ScrollView
                    ref="content"
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={
                      this.props.pullupClosestHeight <= PULLUP_HALF_SPAN
                    }>
                    <View
                      style={{
                        paddingBottom:
                          this.state.keyboardHeight + this.props.navBarHeight
                      }}>
                      {this.props.children}
                    </View>
                  </ScrollView>
                  <LinearGradient
                    pointerEvents="none"
                    colors={[Colours.Transparent, Colours.Foreground]}
                    style={styles.gradient}/>
                </Animatable.View>
              </TouchableWithoutFeedback>
            </Animatable.View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );
  }

  _onKeyboardUpdate(evt, type = "show") {
    this.setState({
      keyboardHeight: type == "show" ? evt.endCoordinates.height || 0 : 0
    });

    // fullscreen cart
    type === "show"
      && this.props.pullupHeight < PULLUP_FULL_SPAN
      && this.snap(PULLUP_FULL_SPAN, true);
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  overlay: {
    flex: 1,
    backgroundColor: Colours.DarkTransparent
  },

  pullupContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: PULLUP_LOW_SPAN,
    backgroundColor: Colours.Background
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
