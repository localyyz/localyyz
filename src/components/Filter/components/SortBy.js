import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { Styles, Colours, Sizes } from "localyyz/constants";

// third party
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

export default class SortBy extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,

    // injected by mobx
    sortBy: PropTypes.string,
    setSortBy: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    !this.isSelected && this.props.setSortBy(this.props.value);
  }

  get isSelected() {
    return this.props.sortBy === this.props.value;
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          <Animatable.View
            animation={this.isSelected ? "fadeInLeft" : "fadeOut"}
            duration={300}
            style={styles.icon}>
            <MaterialIcon
              name="arrow-forward"
              size={Sizes.Text}
              color={Colours.Text}/>
          </Animatable.View>
          <Text style={this.isSelected ? styles.selected : styles.unselected}>
            {this.props.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    alignItems: "center",
    paddingVertical: Sizes.InnerFrame / 6
  },

  icon: {
    minWidth: Sizes.OuterFrame
  },

  unselected: {
    ...Styles.Text,
    ...Styles.SmallText
  }
});
