import React from "react";
import {
  View,
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking
} from "react-native";

// third party
import * as Animatable from "react-native-animatable";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

// custom
import { Sizes, Styles } from "~/src/constants";
import { OS } from "~/src/global";

export default class NotfPrompt extends React.Component {
  static defaultProps = {
    title: "",
    promptText: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      notificationsEnabled: false,
      hasPrompted: false,
      hasDismissed: false,

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

  _checkNotify = () => {
    const callback = state => {
      this.setState({
        notificationsEnabled: state.notificationsEnabled,
        hasPrompted: state.hasPrompted
      });
    };

    // check push subscription state
    OS.getSubscriptionState(callback);
  };

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

  onPressNotify = () => {
    const callback = state => {
      this.setState({ hasPrompted: true, notificationsEnabled: state });
    };

    // based on if prompted + state =>
    if (!this.state.notificationsEnabled) {
      if (this.state.hasPrompted) {
        Linking.openURL("app-settings:");
      } else {
        OS.promptNotify(callback);
      }
    }
  };

  onDismiss = () => {
    this.setState({ hasDismissed: true });
  };

  render() {
    return !this.state.hasDismissed && !this.state.notificationsEnabled ? (
      <Animatable.View animation="slideInDown" style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        <TouchableOpacity onPress={this.onPressNotify}>
          <View style={{ padding: Sizes.InnerFrame }}>
            <View style={Styles.RoundedButton}>
              <Text style={Styles.RoundedButtonText}>
                {this.state.hasPrompted
                  ? "Change Settings"
                  : this.props.promptText}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.dismiss}>
          <TouchableOpacity onPress={this.onDismiss}>
            <MaterialCommunityIcon name="close" size={Sizes.ActionButton} />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: Sizes.InnerFrame,
    paddingTop: Sizes.OuterFrame * 2
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    textAlign: "center"
  },

  dismiss: {
    position: "absolute",
    top: Sizes.InnerFrame,
    right: Sizes.InnerFrame
  }
});
