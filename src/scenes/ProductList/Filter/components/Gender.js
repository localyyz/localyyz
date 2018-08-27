import React from "react";
import { TouchableOpacity } from "react-native";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { SloppyView } from "localyyz/components";

// constants
const GENDERS = ["unknown", "man", "woman"];
const GENDER_ICON = ["human-male-female", "human-male", "human-female"];

@inject(stores => ({
  gender: stores.filterStore.gender,
  setFilter: stores.filterStore.setGenderFilter
}))
@observer
export default class Gender extends React.Component {
  static propTypes = {
    // mobx
    gender: PropTypes.string,
    setFilter: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  get selectedIndex() {
    let index = GENDERS.findIndex(gender => gender === this.props.gender);
    return index >= 0 ? index : 0;
  }

  onPress() {
    this.props.setFilter(GENDERS[(this.selectedIndex + 1) % GENDERS.length]);
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <SloppyView>
          <MaterialCommunityIcon
            name={GENDER_ICON[this.selectedIndex]}
            size={Sizes.Text}
            color={Colours.Text}/>
        </SloppyView>
      </TouchableOpacity>
    );
  }
}
