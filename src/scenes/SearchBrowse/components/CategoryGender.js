import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";

// constants
const GENDERS = [
  { id: "female", label: "Woman", filterId: "woman" },
  { id: "male", label: "Man", filterId: "man" },
  { id: "unisex", label: "Unisex", filterId: "unisex" }
];
const GENDER_MAPPING = Object.assign(
  {},
  ...GENDERS.map(gender => ({ [gender.id]: gender }))
);

@inject(stores => ({
  gender: stores.searchStore.gender,
  setGender: stores.searchStore.setGender,
  userGender: stores.userStore.gender
}))
@observer
export default class CategoryGender extends React.Component {
  constructor(props) {
    super(props);

    // auto select gender if not given from user settings
    !props.gender
      && GENDER_MAPPING[props.userGender]
      && props.setGender(GENDER_MAPPING[props.userGender]);
  }

  render() {
    return (
      <View style={styles.container}>
        {GENDERS.map((gender, i) => (
          <View style={styles.button} key={`gender-${gender.id}-${i}`}>
            <TouchableOpacity onPress={() => this.props.setGender(gender)}>
              <View
                style={[
                  styles.option,
                  this.props.gender
                    && this.props.gender.id == gender.id
                    && styles.active
                ]}>
                <Text style={styles.label}>{capitalize(gender.label)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    padding: Sizes.InnerFrame
  },

  button: {
    flex: 1,
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
