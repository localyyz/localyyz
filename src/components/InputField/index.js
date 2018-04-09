import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { Sizes, Colours, Styles } from "localyyz/constants";

// third party
import EntypoIcon from "react-native-vector-icons/Entypo";

export default class InputField extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.blur = this.blur.bind(this);
    this.focus = this.focus.bind(this);
    this.update = this.update.bind(this);
  }

  blur() {
    this.refs.input && this.refs.input.blur();
  }

  focus() {
    this.refs.input && this.refs.input.focus();
  }

  update() {
    this.refs.input && this.refs.input.update();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.underline}>
          <TextInput
            ref="input"
            {...this.props}
            placeholder={this.props.placeholder}
            placeholderTextColor={Colours.SubduedText}
            style={styles.input}
          />
          {this.props.icon && (
            <EntypoIcon
              name={this.props.icon}
              size={Sizes.Text}
              color={Colours.SubduedText}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.InnerFrame / 2
  },

  underline: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingVertical: Sizes.InnerFrame / 3,
    borderBottomColor: Colours.SubduedText,
    borderBottomWidth: 1 / 2
  },

  input: {
    ...Styles.Text,
    ...Styles.SmallText,
    flex: 1,
    marginRight: Sizes.InnerFrame
  }
});
