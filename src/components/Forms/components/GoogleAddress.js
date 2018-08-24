import React from "react";
import { StyleSheet } from "react-native";

// custom
import {
  Styles,
  Sizes,
  Colours,
  GOOGLE_PLACES_KEY,
  DEFAULT_ADDRESS
} from "localyyz/constants";
import { UserAddress } from "localyyz/models";

// third party
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { inject, observer } from "mobx-react/native";

// local
import BaseField from "./BaseField";

@inject((stores, props) => ({
  onValueChange: value =>
    props.field && stores.formStore.update(props.field, value),
  value: props.field && stores.formStore.data[props.field],
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
    this._onAddressSelect = this._onAddressSelect.bind(this);
    this._syncToMappedFields = this._syncToMappedFields.bind(this);

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

  _syncToMappedFields(address) {
    let _address = address.toJS();

    // write out the UserAddress to mapped fields (by the injected update)
    // skipping if not set
    Object.keys(_address).forEach(
      k => _address[k] != null && this.props.update(k, _address[k])
    );
  }

  _onAddressSelect(data, details) {
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
            address.set({ city: component.short_name });
            break;
          case "administrative_area_level_1":
            address.set({ province: component.short_name });
            break;
          case "country":
            address.set({
              country: component.long_name,
              countryCode: component.short_name
            });
            break;
          case "postal_code":
            address.set({ zip: component.short_name });
            break;
        }
      }
    });

    // and write the UserAddress to formStore, allowing injected field sync
    // to take care of mapping to other synced fields
    this.props.onValueChange(address);
  }

  render() {
    return !this.props.value ? (
      <BaseField label="Address">
        <GooglePlacesAutocomplete
          fetchDetails
          listViewDisplayed
          currentLocation={true}
          currentLocationLabel="Use current location"
          minLength={2}
          debounce={200}
          returnKeyType="search"
          placeholder={DEFAULT_ADDRESS}
          query={{ key: GOOGLE_PLACES_KEY, type: "address" }}
          GooglePlacesSearchQuery={{ rankby: "distance" }}
          onPress={this._onAddressSelect}
          placeholderTextColor={Colours.SubduedText}
          styles={styles}/>
      </BaseField>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {},

  textInputContainer: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
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
    height: 0
  },

  poweredContainer: {
    height: 0
  },

  powered: {
    height: 0
  }
});
