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
    count: PropTypes.number
  };

  render() {
    return this.props.count != null ? (
      <View style={styles.container}>
        <Text style={styles.label}>
          Showing <Text style={Styles.Emphasized}>{this.props.count}</Text>{" "}
          products
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
    ...Styles.SmallText
  }
});
