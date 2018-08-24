import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";

// third party
import { Provider, observer, inject } from "mobx-react/native";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";
import { BaseForm, Forms } from "localyyz/components";
import { UserAddress } from "localyyz/models";

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
  constructor(props) {
    super(props);
    this.settings
      = (this.props.navigation
        && this.props.navigation.state
        && this.props.navigation.state.params)
      || {};
    this.store = new BaseForm.Store(
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
      { id: "region", validators: ["isRequired"] },
      { id: "postal", validators: ["isRequired"] },
      {
        id: "country",
        validators: ["isRequired"]
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

    // bindings
    this.submit = this.submit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentDidMount() {
    // merge in outside data if provided, if address was never touched,
    // allowing address component field syncing break it up into
    // all the associated fields
    this.settings.address
      && this.store
      && !this.store.data.address
      && this.store.update("address", this.settings.address);
  }

  async submit() {
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
      Alert.alert("Please try again later", err);
    }
  }

  async delete() {
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
      Alert.alert("Please try again later", err);
    }
  }

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

  render() {
    return (
      <View style={styles.container}>
        <Provider formStore={this.store}>
          <BaseForm
            backAction={() => this.props.navigation.goBack(null)}
            title={this.title}>
            <View style={Styles.Horizontal}>
              <Forms.Field field="firstName" label="First name" />
              <Forms.Field
                field="lastName"
                label="Last name"
                style={styles.largerField}/>
            </View>
            {!this.store.data.address && !this.state.manual ? (
              <Forms.Address field="address" />
            ) : (
              <View>
                <View style={Styles.Horizontal}>
                  <Forms.Field
                    field="street"
                    label="Address"
                    style={styles.largerField}/>
                  <Forms.Field field="addressOpt" label="Unit/Suite" />
                </View>
                <Forms.Field field="city" label="City" />
                <View style={Styles.Horizontal}>
                  <Forms.Field
                    field="region"
                    label="Province"
                    style={styles.largerField}/>
                  <Forms.Field field="postal" label="Postal Code" />
                </View>
                <Forms.Field field="country" label="Country" />
              </View>
            )}
            <View style={styles.buttons}>
              {!this.state.manual ? (
                <Forms.Button
                  isEnabled
                  onPress={() => this.setState({ manual: true })}>
                  Enter address manually
                </Forms.Button>
              ) : (
                <View />
              )}
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
          </BaseForm>
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  largerField: {
    flex: 1
  },

  buttons: {
    marginTop: Sizes.InnerFrame
  }
});
