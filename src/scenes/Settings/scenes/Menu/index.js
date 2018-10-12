import React from "react";
import { View, StyleSheet, Text, Alert, Linking } from "react-native";

// third party
import { inject, observer, Provider } from "mobx-react/native";
import DeviceInfo from "react-native-device-info";

// custom
import {
  Sizes,
  Styles,
  PRIVACY_POLICY_URI,
  TERMS_AND_CONDITIONS_URI
} from "localyyz/constants";
import { BaseForm, Forms } from "localyyz/components";

// local
import MenuUIStore from "./store";

@inject(stores => ({
  logout: stores.loginStore.logout,
  hasSession: stores.userStore.hasSession,
  userStore: stores.userStore,
  gender: stores.userStore.gender
}))
@observer
export default class SettingsMenu extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.updateGender = this.updateGender.bind(this);
    this.showOrders = this.showOrders.bind(this);
    this.showAddresses = this.showAddresses.bind(this);
    this.logout = this.logout.bind(this);

    // stores
    this.store = new MenuUIStore(this.props.userStore);
    this.formStore = new BaseForm.Store(
      {
        id: "gender",
        value: this.props.gender || undefined,
        validators: ["isRequired"],
        options: {
          male: { label: "Male fashion" },
          female: { label: "Female fashion" }
        },
        onValueChange: this.updateGender
      },
      {
        id: "currency",
        value: "usd",
        options: {
          usd: { label: "US Dollar (USD $)" }
        }
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.gender != prevProps.gender) {
      this.formStore.update("gender", this.props.gender);
    }
  }

  updateGender(gender) {
    this.store.setGender(gender);
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
        <BaseForm title="Settings">
          {this.props.hasSession ? (
            <Forms.Section label="Orders">
              <Forms.BaseField
                label="Order history"
                onPress={this.showOrders}/>
            </Forms.Section>
          ) : null}
          <Forms.Section label="Display">
            <Forms.Picker isHorizontal field="currency" label="Currency" />
          </Forms.Section>
          <Forms.Section label="Account">
            <Forms.BaseField
              label="Browsing history"
              onPress={() => this.props.navigation.navigate("History")}/>
            <Forms.BaseField
              label="Favourites"
              onPress={() => {
                this.props.navigation.navigate("Favourite", {
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
                <Forms.Picker
                  isHorizontal
                  field="gender"
                  label="I'd prefer to see more of"/>
              </View>
            ) : (
              <View>
                <Forms.BaseField
                  label="Sign in"
                  onPress={() => this.props.navigation.navigate("Login")}/>
              </View>
            )}
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
        </BaseForm>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    marginVertical: Sizes.InnerFrame / 2
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
