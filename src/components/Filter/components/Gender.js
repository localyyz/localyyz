import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

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
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          <Text>{this.props.label} </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
