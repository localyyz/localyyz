import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";

// constants
const GENDERS = [
  { id: "female", label: "WOMEN", filterId: "woman" },
  { id: "male", label: "MEN", filterId: "man" }
];
const GENDER_MAPPING = Object.assign(
  {},
  ...GENDERS.map(gender => ({ [gender.id]: gender }))
);

// NOTE: props is a work around for testing.
@inject((stores, props) => ({
  gender: (stores.searchStore || props).gender,
  setGender: (stores.searchStore || props).setGender
}))
@observer
export default class CategoryGender extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {GENDERS.map(gender => (
          <TouchableOpacity
            key={`gender-${gender.id}`}
            onPress={() => this.props.setGender(gender)}>
            <View style={styles.button}>
              <View
                style={[
                  styles.option,
                  this.props.gender
                    && this.props.gender.id == gender.id
                    && styles.active
                ]}>
                <Text style={styles.label}>{capitalize(gender.label)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    padding: Sizes.InnerFrame,
    width: Sizes.Width,
    justifyContent: "space-around"
  },

  button: {
    alignItems: "center",
    justifyContent: "center"
  },

  option: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.InnerFrame / 4,
    paddingHorizontal: Sizes.OuterFrame * 2 / 3,
    borderRadius: Sizes.InnerFrame
  },

  active: {
    backgroundColor: Colours.Action
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized
  }
});
