import React from "react";
import {
  AppState,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking
} from "react-native";
import { observer, inject } from "mobx-react/native";
import { BlurView } from "react-native-blur";
import * as Animatable from "react-native-animatable";

import { Placeholder as ProductTilePlaceholder } from "~/src/components/ProductTileV2";
import { BadgeType } from "~/src/components/ProductTileV2/Badge";
import { Colours, Sizes, Styles } from "~/src/constants";
import { OS } from "~/src/global";

// there is an issue with safe area view with react navigation modal
// and for some reason adding top level padding breaks swiper (probably because
// it relies on onLayout to do some state calculation)
const SlidePaddingTop = Sizes.ScreenTop + Sizes.OuterFrame * 3;

@inject(stores => ({
  onboardingStore: stores.onboardingStore
}))
@observer
export default class Outro extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.onboardingStore;
    this.state = {
      isPrompting: false,

      notificationsEnabled: false,
      hasPrompted: false,

      currentState: AppState.currentState
    };
  }

  /* states:
   *  
   * prompted, enabled
   * N, N => show prompt buttons
   * Y, N => finish
   * Y, Y => finish
   */
  componentDidMount() {
    AppState.addEventListener("change", this._appStateListener);
    this._checkNotify();
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._appStateListener);
  }

  _appStateListener = nextState => {
    if (
      this.state.currentState.match(/inactive|background/)
      && nextState === "active"
    ) {
      // recheck notification status
      this._checkNotify();
    }
    this.state.currentState = nextState;
  };

  _checkNotify = () => {
    const callback = state => {
      this.setState({
        notificationsEnabled: state.notificationsEnabled,
        hasPrompted: state.hasPrompted
      });
      if (state.hasPrompted) {
        // if has prompted, we can finish
        this.store.canFinish = true;
      }
    };

    // check push subscription state
    OS.getSubscriptionState(callback);
  };

  onPressNotify = () => {
    const callback = state => {
      this.setState(
        { isPrompting: false, hasPrompted: true, notificationsEnabled: state },
        () => {
          // whatever the result, we can finish
          this.store.canFinish = true;
        }
      );
    };

    // based on if prompted + state =>
    if (!this.state.notificationsEnabled) {
      if (this.state.hasPrompted) {
        Linking.openURL("app-settings:");
      } else {
        this.setState({ isPrompting: true }, () => {
          OS.promptNotify(callback);
        });
      }
    }
  };

  render() {
    let messaging = "the best deals";
    let sortedBy = this.store.selectedToParams.sort;
    let badgeType = BadgeType.Deal;
    if (sortedBy && sortedBy.length) {
      switch (sortedBy[0]) {
        case "newest":
          messaging = "the newest fashion";
          badgeType = BadgeType.New;
          break;
        case "trending":
          messaging = "what's trending";
          badgeType = BadgeType.Trend;
          break;
        case "bestselling":
          messaging = "the best selling items";
          badgeType = BadgeType.BestSell;
          break;
        case "bestdeal":
          messaging = "the best deals";
          badgeType = BadgeType.Deal;
          break;
      }
    }

    return (
      <View key="outro" style={styles.outro}>
        <Text style={styles.h1}>Almost there!</Text>
        <Text style={styles.subtitle}>
          Want updates on{" "}
          <Text style={{ fontWeight: "bold" }}>{messaging}</Text> curated just
          for you?
        </Text>
        <Animatable.View
          animation={
            this.store.slideIndex === this.store.questions.length - 1
              ? "zoomIn"
              : ""
          }
          style={styles.placeholder}>
          <View
            style={{
              width: Sizes.Width / 2,
              height: Sizes.Width / 2,
              top: Sizes.OuterFrame * 2,
              left: -Sizes.OuterFrame * 2,
              position: "absolute",
              backgroundColor: Colours.BackgroundAccent
            }}/>
          <View
            style={{
              width: Sizes.Width / 2,
              height: Sizes.Width / 2,
              bottom: Sizes.OuterFrame * 2,
              right: -Sizes.OuterFrame * 2,
              position: "absolute",
              backgroundColor: Colours.BackgroundAccent
            }}/>
          <ProductTilePlaceholder scale={0.9} badgeType={badgeType} />
        </Animatable.View>
        {!this.state.hasPrompted ? (
          <Text
            style={[
              styles.subtitle,
              { paddingTop: 8, fontSize: Sizes.SmallText }
            ]}>
            You can turn them off any time.
          </Text>
        ) : null}
        <TouchableOpacity onPress={this.onPressNotify}>
          <View style={{ padding: Sizes.InnerFrame }}>
            <View
              style={[
                Styles.RoundedButton,
                this.state.notificationsEnabled
                  ? { backgroundColor: Colours.Accented }
                  : null
              ]}>
              <Text style={Styles.RoundedButtonText}>
                {this.state.hasPrompted
                  ? this.state.notificationsEnabled
                    ? "Subscribed!"
                    : "Change Settings"
                  : "Yes, I want in!"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {!this.state.hasPrompted ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.setState({ hasPrompted: true }, () => {
                this.store.canFinish = true;
              });
            }}>
            <View>
              <Text style={{ fontSize: Sizes.SmallText }}>
                No, I like missing out 😉
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {this.state.isPrompting ? (
          <BlurView
            style={styles.blurOverlay}
            blurType="light"
            blurAmount={20}/>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outro: {
    paddingTop: SlidePaddingTop,
    paddingBottom: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame,
    justifyContent: "center",
    alignItems: "center",
    minHeight: Sizes.InnerFrame * 3,
    backgroundColor: Colours.Transparent
  },

  blurOverlay: {
    ...Styles.Overlay
  },

  placeholder: {
    paddingVertical: Sizes.OuterFrame
  },

  h1: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    ...Styles.Title,
    paddingBottom: Sizes.InnerFrame
  },

  subtitle: {
    ...Styles.Text
  }
});
