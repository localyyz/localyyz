import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

@inject(stores => ({
  gender: stores.filterStore.gender,
  setGenderFilter: stores.filterStore.setGenderFilter
}))
@observer
export default class Gender extends React.Component {
  static propTypes = {
    val: PropTypes.string
  };

  onPress(val) {
    this.props.setGenderFilter(val);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.setGenderFilter("woman")}>
          <View>
            <Text
              style={
                this.props.gender === "woman"
                  ? styles.selected
                  : styles.unselected
              }>
              woman
            </Text>
          </View>
        </TouchableOpacity>
        <Text>/</Text>
        <TouchableOpacity onPress={() => this.props.setGenderFilter("man")}>
          <View>
            <Text
              style={
                this.props.gender === "man"
                  ? styles.selected
                  : styles.unselected
              }>
              man
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 2,
    flexDirection: "row"
  },

  unselected: {
    ...Styles.Text,
    ...Styles.SmallText
  }
});
