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

import { Colours, Sizes, Styles } from "~/src/constants";
import { OS } from "~/src/global";

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
        this.store.hasPromptedNotf = true;
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
          this.store.hasPromptedNotf = true;
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
    if (sortedBy && sortedBy.length) {
      switch (sortedBy[0]) {
        case "newest":
          messaging = "the newest fashion";
          break;
        case "trending":
          messaging = "what's trending";
          break;
        case "bestselling":
          messaging = "the best selling items";
          break;
        case "bestdeal":
          messaging = "the best deals";
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
                this.store.hasPromptedNotf = true;
              });
            }}>
            <View>
              <Text
                style={{
                  fontSize: Sizes.SmallText,
                  color: Colours.Foreground
                }}>
                No, I like missing out 😉
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outro: {
    paddingBottom: Sizes.Height / 4,
    paddingHorizontal: Sizes.OuterFrame,
    justifyContent: "center",
    alignItems: "center",
    minHeight: Sizes.Height,
    backgroundColor: Colours.Transparent
  },

  h1: {
    ...Styles.Text,
    ...Styles.EmphasizedText,
    ...Styles.Title,
    paddingBottom: Sizes.InnerFrame,
    color: Colours.Foreground
  },

  subtitle: {
    ...Styles.Text,
    color: Colours.Foreground
  }
});
