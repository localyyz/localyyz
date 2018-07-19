import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

// custom
import { Sizes } from "localyyz/constants";
import { SloppyView } from "localyyz/components";

// local
import ExpandableHeader from "./ExpandableHeader";

@inject(stores => ({
  gender: stores.filterStore.gender,
  setFilter: stores.filterStore.setGenderFilter
}))
@observer
export default class Gender extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,

    // mobx
    setFilter: PropTypes.func.isRequired,
    gender: PropTypes.string
  };

  onPress = () => {
    this.props.setFilter(this.props.value);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={styles.container}>
        <SloppyView>
          <ExpandableHeader
            hideCollapse
            isOpen={this.props.gender === this.props.value}
            enabled={true}>
            {this.props.label}
          </ExpandableHeader>
        </SloppyView>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 2
  }
});
