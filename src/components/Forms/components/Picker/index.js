import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";

// local
import BaseField from "../BaseField";
import { Provider } from "./components";

@inject((stores, props) => ({
  validators:
    (props.field
      && stores.formStore._data[props.field]
      && stores.formStore._data[props.field].validators)
    || [],
  value: props.field && stores.formStore.data[props.field],
  fieldData: props.field && stores.formStore._data[props.field],
  show: () => stores.pickerStore.show(props.field)
}))
@observer
export default class Picker extends React.Component {
  static Provider = Provider;

  get value() {
    return this.props.value;
  }

  get label() {
    return (
      (this.props.fieldData.options[this.value]
        && this.props.fieldData.options[this.value].label)
      || "Not selected"
    );
  }

  get isValid() {
    // test all provided validators and any built in ones
    // null is a strange initial state, where it's "valid" but not really to
    // hide error messages
    return this.value !== null ? this.errorMessage === null : true;
  }

  get errorMessage() {
    let errors = this.props.validators
      .map(validator => validator(this.value))
      .filter(result => result !== true);

    // use first error, higher priority validators should be first in line
    return errors.length > 0 ? errors[0] : null;
  }

  render() {
    return (
      <TouchableOpacity onPress={this.props.show}>
        <BaseField
          {...this.props}
          isHorizontal
          hasError={!this.isValid}
          label={this.props.label}
          error={this.errorMessage}
          style={this.props.style}>
          <View style={styles.content}>
            <View style={styles.value}>
              <Text style={styles.label}>{this.label}</Text>
            </View>
            <View style={styles.arrow}>
              <MaterialIcon
                name="keyboard-arrow-down"
                size={Sizes.Text}
                color={Colours.SubduedText}/>
            </View>
          </View>
        </BaseField>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  value: {
    flex: 1,
    alignItems: "flex-end"
  },

  label: {
    ...Styles.Input
  },

  arrow: {
    marginLeft: Sizes.InnerFrame / 2
  }
});
