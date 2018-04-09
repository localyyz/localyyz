import React from "react";
import { StyleSheet, Picker, TouchableWithoutFeedback } from "react-native";
import { Sizes, Colours } from "localyyz/constants";

// third party
import * as Animatable from "react-native-animatable";

export default class PickerFieldModal extends React.Component {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onDismiss}>
        <Animatable.View
          animation="fadeIn"
          ease="ease-out"
          duration={500}
          style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animatable.View
              animation="fadeInUp"
              ease="ease-out"
              delay={400}
              duration={300}
              style={styles.container}>
              <Picker
                selectedValue={this.props.selectedValue}
                onValueChange={this.props.onValueChange}>
                {Object.keys(this.props.options || {})
                  .map(option => ({
                    ...this.props.options[option],
                    value: option
                  }))
                  .map(option => (
                    <Picker.Item
                      key={`option-${option.value}`}
                      label={option.label || option.value}
                      value={option.value}
                    />
                  ))}
              </Picker>
            </Animatable.View>
          </TouchableWithoutFeedback>
        </Animatable.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "flex-end",
    backgroundColor: Colours.DarkTransparent
  },

  container: {
    marginHorizontal: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  }
});
