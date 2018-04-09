import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import {
  Colours,
  Sizes,
  Styles,
  GOOGLE_PLACES_KEY,
  DEFAULT_ADDRESS,
  DEFAULT_ADDRESS_OPT,
  DEFAULT_NAME
} from "localyyz/constants";
import { UserAddress } from "localyyz/models";
import CartField from "./CartField";

// third party
import * as Animatable from "react-native-animatable";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { inject } from "mobx-react";

@inject("addressStore")
export default class AddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.addressStore;
    this.state = {
      address: new UserAddress({
        ..._splitName(this.props.defaultName),
        isShipping: true,
        isBilling: true
      }),
      name: this.props.defaultName,
      addressOpt: null,
      submitted: false
    };

    // bindings
    this.onAddressSelect = this.onAddressSelect.bind(this);
    this.onAddressOptUpdate = this.onAddressOptUpdate.bind(this);
    this.onNameUpdate = this.onNameUpdate.bind(this);
    this.onSaveAddress = this.onSaveAddress.bind(this);
  }

  UNSAFE_componentWillReceiveProps(next) {
    // defaultName changes updates state
    next.defaultName !== this.props.defaultName &&
      this.onNameUpdate(next.defaultName);
  }

  get isComplete() {
    return (
      this.state.address &&
      !!this.state.address.address &&
      !!this.state.address.streetNumber &&
      !!this.state.address.city &&
      !!this.state.address.province &&
      !!this.state.address.zip &&
      !!this.state.address.country
    );
  }

  onAddressSelect(data, details) {
    let address = {};
    details.address_components.map(component => {
      if (component.types && component.types.length > 0) {
        switch (component.types[0]) {
          case "street_number":
            address.address = `${component.short_name}${
              !!address.address ? ` ${address.address}` : ""
            }`;
            address.streetNumber = component.short_name;
            break;
          case "route":
            address.address = `${
              !!address.streetNumber ? `${address.streetNumber} ` : ""
            }${component.short_name}`;
            break;
          case "locality":
          case "sublocality_level_1":
            address.city = component.short_name;
            break;
          case "administrative_area_level_1":
            address.province = component.short_name;
            break;
          case "country":
            address.country = component.long_name;
            address.countryCode = component.short_name;
            break;
          case "postal_code":
            address.zip = component.short_name;
            break;
        }
      }
    });

    // reuse previous address to retain name/opt
    // TODO: may have strange bugs from previously
    // stored address (merging with a new one)
    this.state.address.set(address);
    this.setState({ address: this.state.address });

    // focus on name or suite next
    this.isNameReady ? this.refs.addressOpt.focus() : this.refs.name.focus();
  }

  onNameUpdate(name) {
    this.state.address.set(_splitName(name));
    this.setState({
      address: this.state.address,
      name: name,
      isNameInvalid: null
    });
  }

  onAddressOptUpdate(addressOpt) {
    this.state.address.set({ addressOpt: addressOpt });
    this.setState({ address: this.state.address, addressOpt: addressOpt });
  }

  onSaveAddress() {
    if (!this.state.address.address || !this.isComplete) {
      // error out and focus to field
      Alert.alert(
        "Invalid address",
        "There's an issue with the entered shipping address"
      );
      this.refs.address.triggerFocus();
    } else if (!this.isNameReady) {
      this.setState(
        {
          isNameInvalid: true
        },
        this.refs.name.focus
      );
    } else {
      // good to go, try saving it
      this.store.add(this.state.address).then(response => {
        // and send to parent caller
        this.props.onSubmit && this.props.onSubmit(this.state.address);
      });
    }
  }

  get isNameReady() {
    return (
      !!this.state.name &&
      this.state.name.length > 0 &&
      this.state.name.split(" ").length > 1 &&
      this.state.name.split(" ").every(part => part.length > 0)
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          ref="address"
          autoFocus
          fetchDetails
          minLength={2}
          debounce={200}
          returnKeyType="search"
          placeholder={DEFAULT_ADDRESS}
          query={{ key: GOOGLE_PLACES_KEY, type: "address" }}
          GooglePlacesSearchQuery={{ rankby: "distance" }}
          onPress={this.onAddressSelect}
          placeholderTextColor={Colours.SubduedText}
          styles={googleAcStyles}
        />
        <Animatable.View
          animation="fadeInDown"
          duration={200}
          style={[Styles.Horizontal, Styles.EqualColumns]}
        >
          <CartField
            icon="face"
            color={this.state.isNameInvalid && Colours.Fail}
          >
            <TextInput
              ref="name"
              autoCorrect={false}
              value={this.state.name}
              onChangeText={this.onNameUpdate}
              placeholder={DEFAULT_NAME}
              placeholderTextColor={Colours.SubduedText}
              style={[
                Styles.Input,
                this.state.isNameInvalid && {
                  color: Colours.Fail
                }
              ]}
            />
          </CartField>
          <CartField icon="location-city">
            <TextInput
              ref="addressOpt"
              autoCorrect={false}
              value={this.state.addressOpt}
              onChangeText={this.onAddressOptUpdate}
              placeholder={DEFAULT_ADDRESS_OPT}
              placeholderTextColor={Colours.SubduedText}
              style={Styles.Input}
            />
          </CartField>
        </Animatable.View>
        <View style={styles.addAddress}>
          <TouchableOpacity onPress={this.onSaveAddress}>
            <Text
              style={[
                Styles.Text,
                Styles.Terminal,
                Styles.Emphasized,
                Styles.Underlined,
                styles.addAddressLabel
              ]}
            >
              use this address
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function _splitName(name) {
  if (name) {
    const parts = name.split(" ");
    const firstName = parts.slice(0, parts.length - 1).join(" ");
    const lastName = parts[parts.length - 1];
    return {
      firstName: firstName,
      lastName: lastName
    };
  } else {
    return {};
  }
}

const styles = StyleSheet.create({
  container: {},

  addressDetails: {
    marginLeft: Sizes.InnerFrame / 2
  },

  addAddress: {
    padding: Sizes.InnerFrame,
    alignItems: "flex-end"
  }
});

const googleAcStyles = StyleSheet.create({
  container: {},

  textInputContainer: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Transparent,
    height: null
  },

  textInput: {
    ...Styles.Input,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    height: null,
    borderRadius: null
  },

  listView: {
    marginHorizontal: Sizes.InnerFrame
  },

  row: {
    padding: null,
    paddingVertical: Sizes.InnerFrame,
    height: null
  },

  description: {
    ...Styles.Input,
    ...Styles.Subdued,
    marginHorizontal: null
  },

  poweredContainer: {
    height: Sizes.InnerFrame,
    marginBottom: Sizes.InnerFrame / 2
  },

  powered: {
    height: Sizes.InnerFrame
  }
});
