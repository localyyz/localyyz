import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
  Linking
} from "react-native";

// third party
import { inject, observer, Provider } from "mobx-react/native";
import DeviceInfo from "react-native-device-info";

// custom
import {
  Colours,
  Sizes,
  Styles,
  PRIVACY_POLICY_URI,
  TERMS_AND_CONDITIONS_URI
} from "localyyz/constants";
import { Forms } from "localyyz/components";

@inject(stores => ({
  logout: stores.loginStore.logout,
  hasSession: stores.userStore.hasSession,
  messageSupport: stores.supportStore.message
}))
@observer
export default class SettingsMenu extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    header: undefined
  });

  constructor(props) {
    super(props);

    // bindings
    this.showOrders = this.showOrders.bind(this);
    this.showAddresses = this.showAddresses.bind(this);
    this.logout = this.logout.bind(this);

    // stores
    this.formStore = new Forms.Store({
      id: "currency",
      value: "USD (US Dollar)"
    });
  }

  showOrders() {
    return this.props.navigation.navigate("Orders");
  }

  showAddresses() {
    return this.props.navigation.navigate("Addresses");
  }

  logout() {
    Alert.alert(
      "Sign out?",
      "Signing out will clear your account off of this device",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => this.props.logout() }
      ]
    );
  }

  render() {
    return (
      <Provider formStore={this.formStore}>
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.container}>
            {this.props.hasSession ? (
              <Forms.Section label="Orders">
                <Forms.BaseField
                  label="Order history"
                  onPress={this.showOrders}/>
              </Forms.Section>
            ) : null}
            <Forms.Section label="Display">
              <Forms.Field
                isHorizontal
                editable={false}
                field="currency"
                label="Currency"/>
            </Forms.Section>
            <Forms.Section label="Account">
              <Forms.BaseField
                label="Browsing history"
                onPress={() => this.props.navigation.navigate("History")}/>
              <Forms.BaseField
                label="Favourites"
                onPress={() => {
                  this.props.navigation.navigate("Favourites", {
                    fetchPath: "products/favourite",
                    title: "Your favourites"
                  });
                }}/>
              <Forms.BaseField
                label="Personalize"
                onPress={() => {
                  this.props.navigation.navigate("Onboarding");
                }}/>
              {this.props.hasSession ? (
                <View>
                  <Forms.BaseField
                    label="Saved addresses"
                    onPress={this.showAddresses}/>
                </View>
              ) : (
                <View>
                  <Forms.BaseField
                    label="Sign in"
                    onPress={() => this.props.navigation.navigate("Login")}/>
                </View>
              )}
            </Forms.Section>
            <Forms.Section label="Settings">
              <Forms.BaseField
                label="Notifications"
                onPress={() => Linking.openURL("app-settings:")}/>
            </Forms.Section>
            <Forms.Section label="Support">
              <Forms.BaseField
                label="Ask help on Messenger"
                onPress={() => this.props.messageSupport()}/>
            </Forms.Section>
            <Forms.Section label="Legal">
              <Forms.BaseField
                label="Privacy policy"
                onPress={() => Linking.openURL(PRIVACY_POLICY_URI)}/>
              <Forms.BaseField
                label="Terms and conditions"
                onPress={() => Linking.openURL(TERMS_AND_CONDITIONS_URI)}/>
            </Forms.Section>
            {this.props.hasSession ? (
              <Forms.BaseField
                label="Sign out of your account"
                labelStyle={styles.logout}
                onPress={this.logout}/>
            ) : null}
            <View style={styles.footer}>
              <Text
                style={
                  styles.version
                }>{`Build ${DeviceInfo.getBuildNumber()}`}</Text>
            </View>
          </ScrollView>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colours.Foreground
  },

  container: {
    paddingBottom: Sizes.IOSTabBar + Sizes.OuterFrame * 2
  },

  footer: {
    alignItems: "center",
    marginVertical: Sizes.InnerFrame
  },

  version: {
    ...Styles.Text,
    ...Styles.TinyText,
    ...Styles.Subdued
  },

  logout: {
    ...Styles.Emphasized
  }
});
