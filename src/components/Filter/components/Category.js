import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

// localyyz
import { Styles, Sizes } from "localyyz/constants";

// third party
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";

@inject(stores => ({
  setCategoryFilter: stores.filterStore.setCategoryFilter
}))
@observer
export class Category extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    setCategoryFilter: PropTypes.func.isRequired
  };

  onPress = () => {
    this.props.setCategoryFilter(this.props.value);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        <View style={styles.container}>
          <Text style={styles.label}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withNavigation(Category);

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 3
  },

  label: {
    ...Styles.Text,
    ...Styles.EmphasizedText
  }
});
