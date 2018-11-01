import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// custom
import { Styles, Sizes, Colours, GOOGLE_PLACES_KEY } from "localyyz/constants";
import Support from "~/src/components/Support";
import { UserAddress } from "~/src/models";
import { userStore } from "~/src/stores";

// third party
import Moment from "moment";
import Ionicon from "react-native-vector-icons/Ionicons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { inject, observer } from "mobx-react/native";

const minSearchLength = 3;

@inject((stores, props) => ({
  onValueChange: value =>
    props.field && stores.formStore.update(props.field, value),
  mapping: props.field && stores.formStore._data[props.field].mapping,
  update: (type, value) =>
    props.field
    && (stores.formStore._data[props.field].mapping || type)
    && (stores.formStore._data[props.field].mapping[type] || type)
    && stores.formStore.update(
      stores.formStore._data[props.field].mapping[type] || type,
      value
    ),

  // used for injecting field syncing method
  callbacks: stores.formStore._data[props.field].onValueChange,
  addCallback: stores.formStore.addCallback
}))
@observer
export default class GoogleAddress extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this._syncToMappedFields = this._syncToMappedFields.bind(this);

    this.state = {
      hasText: false
    };

    // external field syncing mechanism is provided by this Component via
    // onValueChange, which is injected into the array of onValueChange
    // functions in the store schema if never injected before (only allow a
    // single sync, regardless of multiple GoogleAddress components pointing
    // at the same field schema id)
    if (
      !(
        this._syncToMappedFields == props.callbacks
        || (props.callbacks
          && props.callbacks.length > 0
          && props.callbacks.includes(this._syncToMappedFields))
      )
    ) {
      props.addCallback(props.field, this._syncToMappedFields);
    }
  }

  componentWillMount() {
    navigator.geolocation.requestAuthorization();
  }

  componentDidMount() {
    this._mounted = true;
    // generate a session token for google place autocomplete
    this._sessionToken = `${userStore.inviteCode}${Moment().unix()}`;
    this.getCurrentLocation();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  getCurrentLocation = () => {
    let options = {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 2000
    };
    navigator.geolocation.getCurrentPosition(
      position => {
        if (this._mounted) {
          this.setState({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        }
      },
      error => {
        alert(error.message);
      },
      options
    );
  };

  _syncToMappedFields(address) {
    let _address = address.toJS();

    // write out the UserAddress to mapped fields (by the injected update)
    // skipping if not set
    Object.keys(_address).forEach(
      k => _address[k] != null && this.props.update(k, _address[k])
    );
  }

  _onAddressSelect = (data, details) => {
    // save to formStore, and let reaction perform the mappings
    let address = new UserAddress({});
    let streetName, streetNumber;

    // and its components into mapped fields
    details.address_components.forEach(component => {
      if (component.types && component.types.length > 0) {
        switch (component.types[0]) {
          // part of street
          case "street_number":
            // save part for combining with street later
            streetNumber = component.short_name;
            address.set({
              address: `${streetNumber}${streetName ? ` ${streetName}` : ""}`
            });
            break;

          // second part of street
          case "route":
            // save part for combining with street number later
            streetName = component.short_name;
            address.set({
              address: `${streetNumber ? `${streetNumber} ` : ""}${streetName}`
            });
            break;
          case "locality":
          case "sublocality_level_1":
          case "postal_town": // UK
            address.set({ city: component.long_name });
            break;
          case "administrative_area_level_1":
            address.set({ province: component.long_name });
            break;
          case "country":
            address.set({
              country: component.long_name,
              countryCode: component.short_name
            });
            break;
          case "postal_code_prefix":
          case "postal_code":
            address.set({ zip: component.short_name });
            break;
        }
      }
    });

    // and write the UserAddress to formStore, allowing injected field sync
    // to take care of mapping to other synced fields
    this.props.onValueChange(address);
  };

  _onChangeText = text => {
    this._mounted
      && this.setState({ hasText: text !== "" && text.length >= minSearchLength });
  };

  renderLeftButton = () => {
    return (
      <View style={styles.leftButton}>
        <Ionicon
          name="ios-pin-outline"
          style={{ lineHeight: Sizes.ActionButton }}
          size={Sizes.ActionButton}/>;
      </View>
    );
  };

  renderRow = rowData => {
    const { main_text, secondary_text } = rowData.structured_formatting;

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          {this.renderLeftButton()}
          <View>
            <Text>{main_text}</Text>
            <Text style={{ color: Colours.SubduedText }}>{secondary_text}</Text>
          </View>
        </View>
      </View>
    );
  };

  renderEmpty = () => {
    return this.state.hasText ? (
      <Support title="We can't seem to find your address, can we help you?">
        <View>
          <Text style={[Styles.Text, { textAlign: "center" }]}>OR...</Text>
          <View style={{ marginTop: Sizes.InnerFrame, alignItems: "center" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.props.onPressManual}>
              <View style={styles.manualButton}>
                <Text style={Styles.RoundedButtonText}>
                  Enter address manually
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Support>
    ) : null;
  };

  render() {
    // autocomplete doc https://developers.google.com/places/web-service/autocomplete

    return (
      <GooglePlacesAutocomplete
        ref={ref => (this._placeRef = ref)}
        fetchDetails
        listViewDisplayed
        enablePoweredByContainer={false}
        minLength={minSearchLength}
        debounce={200}
        returnKeyType="search"
        placeholder={"Enter a new address"}
        nearbyPlacesAPI={"GoogleReverseGeocoding"}
        query={{
          key: GOOGLE_PLACES_KEY,
          types: "address",
          sessiontoken: this._sessionToken,
          // specified by lat,lon to filter results by users current location
          location: `${this.state.lat},${this.state.lon}`,
          radius: 10000
        }}
        GoogleReverseGeocodingQuery={{
          // https://developers.google.com/maps/documentation/geocoding/intro#GeocodingRequests
          location_type: "ROOFTOP"
        }}
        textInputProps={{
          onChangeText: this._onChangeText
        }}
        onPress={this._onAddressSelect}
        placeholderTextColor={Colours.SubduedText}
        styles={styles}
        ListEmptyComponent={this.renderEmpty}
        renderLeftButton={this.renderLeftButton}
        renderRow={this.renderRow}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Sizes.InnerFrame,
    paddingTop: Sizes.OuterFrame,
    backgroundColor: Colours.Foreground
  },

  manualButton: {
    ...Styles.RoundedButton,
    backgroundColor: Colours.SecondaryButton
  },

  inner: {
    padding: Sizes.OuterFrame
  },

  leftButton: {
    paddingHorizontal: Sizes.InnerFrame
  },

  textInputContainer: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: Colours.Transparent,
    height: null
  },

  textInput: {
    ...Styles.Input,
    fontSize: Sizes.LargeInput,
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

  listView: {},

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

  separator: {
    borderBottomColor: Colours.Border,
    borderBottomWidth: Sizes.Hairline
  },

  poweredContainer: {
    height: 0
  },

  powered: {
    height: 0
  }
});
