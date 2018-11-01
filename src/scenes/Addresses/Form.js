import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView
} from "react-native";

// third party
import { Provider, observer, inject } from "mobx-react/native";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";
import { Forms } from "localyyz/components";
import { UserAddress } from "localyyz/models";
import { navbarStore } from "~/src/stores";

import GoogleAddress from "./GoogleAddress";

// constants
const DEBUG = false;
const SERVER_FAILURE
  = "There was an internal server error and your request could not be processed";

@inject(stores => ({
  add: address => stores.addressStore.add(address),
  update: address => stores.addressStore.update(address),
  delete: address => stores.addressStore.remove(address.id)
}))
@observer
export default class AddressForm extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => ({
    ...navigationOptions,
    title: navigation.getParam("title", "Edit")
  });

  constructor(props) {
    super(props);
    this.settings
      = (this.props.navigation
        && this.props.navigation.state
        && this.props.navigation.state.params)
      || {};
    this.store = new Forms.Store(
      // internally used
      "id",

      // associated form fields
      {
        id: "firstName",
        validators: ["isRequired"]
      },
      { id: "lastName", validators: ["isRequired"] },
      { id: "street", validators: ["isRequired"] },
      "addressOpt",
      { id: "city", validators: ["isRequired"] },
      { id: "region" },
      { id: "postal", validators: ["isRequired"] },
      {
        id: "country",
        validators: ["isRequired"],
        options: {}
      },
      {
        id: "address",

        // mapping UserAddress fields to these fields on update
        mapping: {
          address: "street",
          city: "city",
          province: "region",
          zip: "postal"
        }
      }
    );
    this.state = { manual: false };
  }

  componentDidMount() {
    // merge in outside data if provided, if address was never touched,
    // allowing address component field syncing break it up into
    // all the associated fields
    if (this.settings.address) {
      for (let key in this.settings.address) {
        // NOTE: there are some weird mapping thing going on here, for
        // now just blindly support it
        let mappingKey = "";
        switch (key) {
          case "address":
            mappingKey = "street";
            break;
          case "province":
            mappingKey = "region";
            break;
          case "zip":
            mappingKey = "postal";
            break;
          default:
            mappingKey = key;
        }
        this.store.update(mappingKey, this.settings.address[key]);
      }
    }
  }

  submit = async () => {
    try {
      // attempt update or add
      let address = await (this.shouldUpdate
        ? this.props.update
        : this.props.add)(this.address);

      // bail prematurely due to server failure
      // TODO: call setError for field errors on status 422
      if (address.hasError) {
        throw SERVER_FAILURE;
      }

      // if callback given
      this.settings.onSubmit
        && this.settings.onSubmit(new UserAddress(address));

      // alternative to navigation
      if (this.settings.onComplete) {
        this.settings.onComplete();
      } else {
        this.props.navigation.goBack(null);
      }
    } catch (err) {
      DEBUG && console.log("AddressForm: Failed to set address.", err);
      navbarStore.notify(`${err} - Please try again later`, {
        backgroundColor: Colours.Fail
      });
    }
  };

  delete = async () => {
    try {
      let response = await this.props.delete(this.address);
      if (response.hasError) {
        throw SERVER_FAILURE;
      }

      // if callback given
      this.settings.onDelete && this.settings.onDelete();

      // alternative to navigation
      if (this.settings.onComplete) {
        this.settings.onComplete();
      } else {
        this.props.navigation.goBack();
      }
    } catch (err) {
      DEBUG && console.log("AddressForm: Failed to delete address.", err);
      navbarStore.notify(`${err} - Please try again later`, {
        backgroundColor: Colours.Fail
      });
    }
  };

  get shouldUpdate() {
    return !!this.address && !!this.address.id;
  }

  get submitButton() {
    return (
      this.settings.buttonLabel
      || (this.shouldUpdate ? "Update this address" : "Add this address")
    );
  }

  get deleteButton() {
    return this.settings.deleteButtonLabel || "Remove this address";
  }

  get title() {
    return this.settings.title || this.shouldUpdate
      ? "Update address details"
      : "Add a new address";
  }

  get address() {
    // these are basically reverse of the above merge object, should be in
    // sync with the mapping above
    return this.store.isComplete
      ? new UserAddress({
          id: this.store.data.id,
          address: this.store.data.street,
          city: this.store.data.city,
          province: this.store.data.region,
          zip: this.store.data.postal,
          country: this.store.data.country,
          firstName: this.store.data.firstName,
          lastName: this.store.data.lastName,
          addressOpt: this.store.data.addressOpt
        })
      : null;
  }

  pickCountry = () => {
    this.props.navigation.navigate("CountryPicker", {
      field: "country",
      title: "Select a Country",
      update: value => this.store.update("country", value)
    });
  };

  onSubmitEditing = () => {
    const nextField = this.store.nextField;
    if (nextField) {
      switch (nextField.id) {
        case "firstName":
          this._firstNameRef.focus();
          break;
        case "lastName":
          this._lastNameRef.focus();
          break;
        case "city":
          this._cityRef.focus();
          break;
        case "street":
          this._streetRef.focus();
          break;
        case "postal":
          this._postalRef.focus();
          break;
        case "country":
          this._countryRef.focus();
          break;
      }
    } else {
      Keyboard.dismiss();
    }
  };

  renderManualForm = () => {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={Styles.Horizontal}>
            <Forms.Field
              inputRef={ref => (this._firstNameRef = ref)}
              autoFocus={true}
              onSubmitEditing={this.onSubmitEditing}
              field="firstName"
              label="First name"
              autoCorrect={false}
              style={styles.largerField}/>
          </View>
          <View style={Styles.Horizontal}>
            <Forms.Field
              inputRef={ref => (this._lastNameRef = ref)}
              onSubmitEditing={this.onSubmitEditing}
              field="lastName"
              label="Last name"
              autoCorrect={false}
              style={styles.largerField}/>
          </View>
          <View>
            <View style={Styles.Horizontal}>
              <Forms.Field
                inputRef={ref => (this._streetRef = ref)}
                onSubmitEditing={this.onSubmitEditing}
                field="street"
                label="Address"
                style={styles.largerField}/>
            </View>
            <View style={Styles.Horizontal}>
              <Forms.Field
                field="addressOpt"
                label="Optional Apt, Suite or Floor"
                style={styles.largerField}
                onSubmitEditing={this.onSubmitEditing}/>
            </View>
            <Forms.Field
              inputRef={ref => (this._cityRef = ref)}
              field="city"
              label="City"
              onSubmitEditing={this.onSubmitEditing}/>
            <View style={Styles.Horizontal}>
              <Forms.Field
                field="region"
                label="State/Province/Region"
                onSubmitEditing={this.onSubmitEditing}
                style={styles.largerField}/>
              <Forms.Field
                inputRef={ref => (this._postalRef = ref)}
                field="postal"
                label="Postal Code"
                onSubmitEditing={this.onSubmitEditing}/>
            </View>
            <Forms.Field
              inputRef={ref => (this._countryRef = ref)}
              onPress={this.pickCountry}
              onFocus={this.pickCountry}
              field="country"
              label="Country"/>
          </View>
          <View style={styles.buttons}>
            <Forms.Button onPress={() => this.submit()}>
              {this.submitButton}
            </Forms.Button>
            {this.shouldUpdate ? (
              <Forms.Button
                isEnabled
                onPress={() => this.delete()}
                color={Colours.DisabledButton}
                labelColor={Colours.Text}>
                {this.deleteButton}
              </Forms.Button>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  onPressManual = () => {
    this.setState({ manual: true });
  };

  render() {
    return (
      <Provider formStore={this.store}>
        <SafeAreaView style={styles.container}>
          {this.store.data.street || this.state.manual ? (
            this.renderManualForm()
          ) : (
            <GoogleAddress
              field={"address"}
              onPressManual={this.onPressManual}/>
          )}
        </SafeAreaView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  content: {
    backgroundColor: Colours.Foreground,
    paddingTop: Sizes.OuterFrame,
    paddingBottom: Sizes.IOSTabBar + Sizes.OuterFrame * 2
  },

  largerField: {
    flex: 1
  },

  buttons: {
    marginTop: Sizes.InnerFrame
  }
});
