import React from "react";
import { View, StyleSheet } from "react-native";

// custom
import { Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

// local
import SortBy from "./SortBy";

@inject(stores => ({
  gender: stores.filterStore.gender,
  setGenderFilter: stores.filterStore.setGenderFilter
}))
@observer
export default class Gender extends React.Component {
  static propTypes = {
    setGenderFilter: PropTypes.func.isRequired,
    gender: PropTypes.string
  };

  onPress(val) {
    this.props.setGenderFilter(val);
  }

  render() {
    return (
      <View style={styles.container}>
        <SortBy
          label="Women"
          value="woman"
          sortBy={this.props.gender}
          setSortBy={() => this.onPress("woman")}/>
        <SortBy
          label="Men"
          value="man"
          sortBy={this.props.gender}
          setSortBy={() => this.onPress("man")}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame,
    marginBottom: Sizes.OuterFrame
  }
});
