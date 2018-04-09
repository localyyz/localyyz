import React from "react";
import {
  View, StyleSheet, Text, TouchableOpacity
} from "react-native";
import {
  Colours, Sizes, Styles
} from "localyyz/constants";

export default class OptionsBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.options && props.options.length > 0 && props.options[0]
    };

    // bindings
    this.onOptionsUpdate = this.onOptionsUpdate.bind(this);
  }

  onOptionsUpdate(option) {
    this.setState({
      selected: option
    }, () => this.props.onUpdate && this.props.onUpdate(option));
  }

  render() {
    return this.props.options && this.props.options.length > 0 && (
      <View style={styles.container}>
        {this.props.options.map(option => (
          <TouchableOpacity
            key={`option-${option}`}
            onPress={() => this.onOptionsUpdate(option)}>
            <Text
              style={[styles.option, this.state.selected === option && Styles.Emphasized]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    marginVertical: Sizes.InnerFrame / 2,
    flexWrap: "wrap"
  },

  option: {
    ...Styles.Text,
    ...Styles.Terminal,
    marginRight: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame,
    flexWrap: "wrap"
  }
});
