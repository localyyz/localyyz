import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Picker
} from "react-native";
import { Sizes, Colours } from "localyyz/constants";

// third party
import * as Animatable from "react-native-animatable";
import { Provider, inject, observer } from "mobx-react/native";

// local
import PickerUIStore from "./store";

@inject(stores => ({
  formStore: stores.formStore,
  getField: field => stores.formStore._data[field],
  onValueChange: (k, v) => stores.formStore.update(k, v)
}))
@observer
export default class PickerProvider extends React.Component {
  constructor(props) {
    super(props);
    this.store = new PickerUIStore(props.formStore);
  }

  render() {
    return (
      <Provider pickerStore={this.store}>
        <View style={styles.container}>
          <View style={styles.children}>{this.props.children}</View>
          {this.store.isVisible ? (
            <Animatable.View
              animation="fadeIn"
              ease="ease-out"
              delay={100}
              duration={300}
              style={styles.overlay}>
              <TouchableWithoutFeedback onPress={this.store.hide}>
                <View style={styles.container} />
              </TouchableWithoutFeedback>
              <Animatable.View
                animation="fadeInUp"
                ease="ease-out"
                delay={400}
                duration={300}
                style={styles.modal}>
                {this.store.visibleField
                && this.props.getField(this.store.visibleField) ? (
                  <Picker
                    selectedValue={
                      this.props.getField(this.store.visibleField).value
                    }
                    onValueChange={value => {
                      if (value != null) {
                        this.props.onValueChange(
                          this.store.visibleField,
                          value
                        );
                        this.store.hide();
                      }
                    }}>
                    {[
                      <Picker.Item
                        key={"default-option"}
                        label="Not selected"/>,
                      ...Object.keys(
                        this.props.getField(this.store.visibleField).options
                          || {}
                      )
                        .map(option => ({
                          ...this.props.getField(this.store.visibleField)
                            .options[option],
                          value: option
                        }))
                        .map(option => (
                          <Picker.Item
                            key={`option-${option.value}`}
                            label={option.label || option.value}
                            value={option.value}/>
                        ))
                    ]}
                  </Picker>
                ) : null}
              </Animatable.View>
            </Animatable.View>
          ) : null}
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  children: {
    flex: 1
  },

  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "flex-end",
    backgroundColor: Colours.DarkTransparent
  },

  modal: {
    paddingHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  }
});
