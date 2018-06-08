import React from "react";
import {
  View,
  StyleSheet,
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
import { UppercasedText } from "localyyz/components";
import { UserAddress } from "localyyz/models";
import CartField from "./CartField";

// third party
import PropTypes from "prop-types";
import * as Animatable from "react-native-animatable";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { inject } from "mobx-react/native";

// constants
const PLACEHOLDER_US = {
  address: "1 Infinite Loop",
  city: "Cupertino",
  province: "CA",
  postal: "10118",
  country: "United States"
};
const PLACEHOLDER_CA = {
  address: "1 Yonge Street",
  city: "Toronto",
  province: "ON",
  postal: "A1A 1A1",
  country: "Canada"
};

const COUNTRY_CODE_US = "US";
const COUNTRY_CODE_CA = "CA";

@inject((stores, props) => ({
  defaultName: (props.cartUiStore || stores.cartUiStore).defaultName,
  add: address => (props.addressStore || stores.addressStore).add(address),
  update: address => (props.addressStore || stores.addressStore).update(address)
}))
export default class AddressForm extends React.Component {
  static propTypes = {
    address: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    isShipping: PropTypes.bool,
    isBilling: PropTypes.bool,

    // mobx injected
    add: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    defaultName: PropTypes.string
  };

  static defaultProps = {
    address: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      address: new UserAddress({
        ..._splitName(this.props.defaultName),
        ...this.addressTypes,
        ...props.address
      }),
      name: props.address.fullName || this.props.defaultName
    };

    // bindings
    this.onAddressSelect = this.onAddressSelect.bind(this);
    this.onAddressOptUpdate = this.onAddressOptUpdate.bind(this);
    this.onAddressComponentUpdate = this.onAddressComponentUpdate.bind(this);
    this.onNameUpdate = this.onNameUpdate.bind(this);
    this.onSaveAddress = this.onSaveAddress.bind(this);
  }

  componentWillReceiveProps(next) {
    // defaultName changes updates state
    next.defaultName !== this.props.defaultName
      && this.onNameUpdate(next.defaultName);
  }

  get addressTypes() {
    return {
      isShipping:
        this.props.address && this.props.address.isShipping != null
          ? this.props.address.isShipping
          : this.props.isShipping != null ? this.props.isShipping : true,
      isBilling:
        this.props.address && this.props.address.isBilling != null
          ? this.props.address.isBilling
          : this.props.isBilling != null ? this.props.isBilling : true
    };
  }

  get isComplete() {
    return (
      this.state.address
      && !!this.state.address.address
      && !!this.state.address.city
      && !!this.state.address.province
      && !!this.state.address.zip
      && !!this.state.address.country
    );
  }

  get isFilled() {
    return (
      this.state.address
      && (!!this.state.address.address
        || !!this.state.address.city
        || !!this.state.address.province
        || !!this.state.address.zip
        || !!this.state.address.country)
    );
  }

  onAddressSelect(data, details) {
    let address = {};
    details.address_components.map(component => {
      if (component.types && component.types.length > 0) {
        switch (component.types[0]) {
          case "street_number":
            address.address = `${component.short_name}${
              address.address ? ` ${address.address}` : ""
            }`;
            address.streetNumber = component.short_name;
            break;
          case "route":
            address.address = `${
              address.streetNumber ? `${address.streetNumber} ` : ""
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
    this.onAddressComponentUpdate("addressOpt", addressOpt);
  }

  onAddressComponentUpdate(field, value) {
    this.state.address.set({ [field]: value });
    this.setState({ address: this.state.address });
  }

  onSaveAddress() {
    if (!this.state.address.address || !this.isComplete) {
      // error out and focus to field
      Alert.alert(
        "Invalid address",
        "There's an issue with the entered shipping address",
        [
          {
            text: "OK",
            onPress: () => {
              // focus on incomplete field
              // NOTE: this on callback so we don't
              // lose text input focus on OK
              if (!this.state.address.address) {
                this.refs.address
                  ? this.refs.address.triggerFocus()
                  : this.refs.manualAddress.focus();
              } else if (!this.state.address.city) {
                this.refs.manualCity.focus();
              } else if (!this.state.address.province) {
                this.refs.manualProvince.focus();
              } else if (!this.state.address.country) {
                this.refs.manualCountry.focus();
              } else if (!this.state.address.zip) {
                this.refs.manualPostal.focus();
              }
            }
          }
        ]
      );
    } else if (!this.isNameReady) {
      this.setState(
        {
          isNameInvalid: true
        },
        this.refs.name.focus
      );
    } else {
      if (this.state.address.id) {
        // good to go, try saving it
        this.props.update(this.state.address).then(() => {
          // and send to parent caller
          this.props.onSubmit(this.state.address);
        });
      } else {
        // good to go, try saving it
        this.props.add(this.state.address).then(address => {
          // and send to parent caller
          // NOTE: takes a returned address value here because
          // we need to save the newly created address id
          this.props.onSubmit(address);
        });
      }
    }
  }
  
  get isNameReady() {
    return (
      !!this.state.name
      && this.state.name.length > 0
      && this.state.name.split(" ").length > 1
      && this.state.name.split(" ").every(part => part.length > 0)
    );
  }

  get labelProvince() {
    switch (this.state.address.countryCode) {
      case COUNTRY_CODE_CA:
        return "Province";
      case COUNTRY_CODE_US:
        return "State";
      default:
        return "State";
    }
  }

  get labelPostal() {
    switch (this.state.address.countryCode) {
      case COUNTRY_CODE_CA:
        return "Postal Code";
      case COUNTRY_CODE_US:
        return "Zip";
      default:
        return "Zip";
    }
  }

  placeHolder = field => {
    switch (this.state.address.countryCode) {
      case COUNTRY_CODE_CA:
        return PLACEHOLDER_CA[field];
      case COUNTRY_CODE_US:
        return PLACEHOLDER_US[field];
      default:
        return PLACEHOLDER_US[field];
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {!this.isFilled ? (
          <GooglePlacesAutocomplete
            ref="address"
            fetchDetails
            minLength={2}
            debounce={200}
            returnKeyType="search"
            placeholder={DEFAULT_ADDRESS}
            query={{ key: GOOGLE_PLACES_KEY, type: "address" }}
            GooglePlacesSearchQuery={{ rankby: "distance" }}
            onPress={this.onAddressSelect}
            placeholderTextColor={Colours.SubduedText}
            styles={googleAcStyles}/>
        ) : null}
        <Animatable.View
          animation="fadeInDown"
          duration={200}
          style={[Styles.Horizontal, Styles.EqualColumns]}>
          <CartField
            icon="face"
            label="First & Last Name"
            color={this.state.isNameInvalid ? Colours.Fail : null}>
            <TextInput
              ref="name"
              autoCorrect={false}
              autoCapitalize="words"
              value={this.state.name}
              onChangeText={this.onNameUpdate}
              placeholder={DEFAULT_NAME}
              placeholderTextColor={Colours.SubduedText}
              style={[
                Styles.Input,
                this.state.isNameInvalid && {
                  color: Colours.Fail
                }
              ]}/>
          </CartField>
        </Animatable.View>
        {this.isFilled ? (
          <Animatable.View
            animation="fadeInDown"
            duration={200}
            style={styles.manualAddressContainer}>
            <View style={[Styles.Horizontal, Styles.EqualColumns]}>
              <CartField icon="home" label="Street Number & Address">
                <TextInput
                  ref="manualAddress"
                  autoCorrect={false}
                  value={this.state.address && this.state.address.address}
                  onChangeText={a =>
                    this.onAddressComponentUpdate("address", a)
                  }
                  placeholder={this.placeHolder("address")}
                  placeholderTextColor={Colours.SubduedText}
                  style={Styles.Input}/>
              </CartField>
            </View>
            <View style={[Styles.Horizontal, Styles.EqualColumns]}>
              <CartField icon="domain" label="Unit Number">
                <TextInput
                  ref="addressOpt"
                  autoCorrect={false}
                  value={this.state.address && this.state.address.addressOpt}
                  onChangeText={this.onAddressOptUpdate}
                  placeholder={DEFAULT_ADDRESS_OPT}
                  placeholderTextColor={Colours.SubduedText}
                  style={Styles.Input}/>
              </CartField>
            </View>
            <View style={[Styles.Horizontal, Styles.EqualColumns]}>
              <CartField icon="location-city" label="City">
                <TextInput
                  ref="manualCity"
                  autoCorrect={false}
                  value={this.state.address && this.state.address.city}
                  onChangeText={a => this.onAddressComponentUpdate("city", a)}
                  placeholder={this.placeHolder("city")}
                  placeholderTextColor={Colours.SubduedText}
                  style={Styles.Input}/>
              </CartField>
              <CartField icon="landscape" label={this.labelProvince}>
                <TextInput
                  ref="manualProvince"
                  autoCorrect={false}
                  value={this.state.address && this.state.address.province}
                  onChangeText={a =>
                    this.onAddressComponentUpdate("province", a)
                  }
                  placeholder={this.placeHolder("province")}
                  placeholderTextColor={Colours.SubduedText}
                  style={Styles.Input}/>
              </CartField>
              <CartField icon="public" label="Country">
                <TextInput
                  ref="manualCountry"
                  autoCorrect={false}
                  value={this.state.address && this.state.address.country}
                  onChangeText={a =>
                    this.onAddressComponentUpdate("country", a)
                  }
                  placeholder={this.placeHolder("country")}
                  placeholderTextColor={Colours.SubduedText}
                  style={Styles.Input}/>
              </CartField>
            </View>
            <View style={[Styles.Horizontal, Styles.EqualColumns]}>
              <CartField icon="mail" label={this.labelPostal}>
                <TextInput
                  ref="manualPostal"
                  autoCorrect={false}
                  value={this.state.address && this.state.address.zip}
                  onChangeText={a => this.onAddressComponentUpdate("zip", a)}
                  placeholder={this.placeHolder("postal")}
                  placeholderTextColor={Colours.SubduedText}
                  style={Styles.Input}/>
              </CartField>
            </View>
          </Animatable.View>
        ) : null}
        <View style={styles.addAddress}>
          <TouchableOpacity onPress={this.onSaveAddress}>
            <View style={Styles.RoundedButton}>
              <UppercasedText style={styles.addButtonLabel}>
                use this address
              </UppercasedText>
            </View>
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
  container: {
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  addAddress: {
    marginHorizontal: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame,
    alignItems: "flex-start"
  },

  addButtonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
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
