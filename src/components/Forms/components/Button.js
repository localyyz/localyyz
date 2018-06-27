import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text
} from "react-native";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

// custom
import { Styles, Sizes, Colours } from "localyyz/constants";

@inject(stores => ({
  isComplete: stores.formStore && stores.formStore.isComplete
}))
@observer
export default class Button extends React.Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    onPress: PropTypes.func,

    // mobx injected
    isComplete: PropTypes.bool
  };

  static defaultProps = {
    onPress: () => {},
    isComplete: false
  };

  get touchableType() {
    return this.isDisabled ? TouchableWithoutFeedback : TouchableOpacity;
  }

  get isDisabled() {
    return (
      !this.props.isEnabled
      && (!!this.props.isDisabled || !this.props.isComplete)
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <this.touchableType
          onPress={!this.isDisabled ? this.props.onPress : null}>
          <View
            style={[
              styles.box,
              this.isDisabled && styles.disabled,
              this.props.color && { backgroundColor: this.props.color }
            ]}>
            <Text
              style={[
                styles.label,
                this.isDisabled && styles.disabledLabel,
                this.props.labelColor && { color: this.props.labelColor }
              ]}>
              {this.props.children}
            </Text>
          </View>
        </this.touchableType>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Sizes.InnerFrame,
    alignItems: "center"
  },

  box: {
    ...Styles.RoundedButton
  },

  disabled: {
    backgroundColor: Colours.DisabledButton
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  disabledLabel: {
    ...Styles.Subdued
  }
});
