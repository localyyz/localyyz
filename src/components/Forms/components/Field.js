import React from "react";
import { StyleSheet, TextInput } from "react-native";

// third party
import {
  observer,
  inject,
  PropTypes as mobxPropTypes
} from "mobx-react/native";
import PropTypes from "prop-types";

// custom
import { Styles } from "localyyz/constants";

// local
import BaseField from "./BaseField";

// constants
const REQUIRED_LABEL = "required";
const OPTIONAL_LABEL = "(optional)";

@inject((stores, props) => ({
  onValueChange: value =>
    props.field && stores.formStore.update(props.field, value),
  validators:
    (props.field
      && stores.formStore._data[props.field]
      && stores.formStore._data[props.field].validators)
    || [],
  value: props.field && stores.formStore.data[props.field],
  isRequired:
    !!props.field
    && !!stores.formStore._data[props.field]
    && !!stores.formStore._data[props.field].isRequired,
  isFormComplete: stores.formStore.isComplete
}))
@observer
export default class Field extends React.Component {
  static propTypes = {
    label: PropTypes.string,

    // mobx injected
    onValueChange: PropTypes.func,
    validators: mobxPropTypes.arrayOrObservableArray,
    value: PropTypes.string
  };

  static defaultProps = {
    validators: []
  };

  constructor(props) {
    super(props);

    // bindings
    this.onUpdate = this.onUpdate.bind(this);
  }

  get value() {
    return this.props.value;
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

  onUpdate(text) {
    this.props.onValueChange && this.props.onValueChange(text);
  }

  render() {
    const hasError = !!this.props.error || !this.isValid;
    const value = hasError ? "" : this.value;

    return (
      <BaseField
        {...this.props}
        hasError={hasError}
        label={this.props.label}
        error={this.props.error || this.errorMessage}
        style={this.props.style}>
        <TextInput
          {...this.props}
          ref={this.props.inputRef}
          placeholder={this.props.isRequired ? REQUIRED_LABEL : OPTIONAL_LABEL}
          value={value}
          onChangeText={this.onUpdate}
          returnKeyType={this.props.isFormComplete ? "done" : "next"}
          style={[styles.input, this.props.inputStyle]}/>
      </BaseField>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    ...Styles.Input
  }
});
