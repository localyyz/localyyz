import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";
import { Styles, Sizes } from "localyyz/constants";

// third party
import { observer, inject } from "mobx-react/native";

@inject(stores => ({
  count: stores.filterStore.numProducts
}))
@observer
export default class ProductCount extends React.Component {
  static propTypes = {
    count: PropTypes.number,

    labelStyle: PropTypes.any
  };

  render() {
    return this.props.count != null ? (
      <View style={styles.container}>
        <Text style={[styles.label, this.props.labelStyle]}>
          Show {this.props.count} products
        </Text>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized
  }
});
