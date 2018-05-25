import React from "react";
import { View, StyleSheet } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// third party
import { inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";

@inject(stores => ({
  isUsed: stores.productStore.product && stores.productStore.product.isUsed
}))
@observer
export default class UsedIndicator extends React.Component {
  static propTypes = {
    isUsed: PropTypes.bool
  };

  static defaultProps = {
    isUsed: false
  };

  render() {
    return this.props.isUsed ? (
      <View style={styles.detailsSection}>
        <View style={styles.detailsAlert}>
          <Text style={Styles.Text}>
            <Text style={Styles.Emphasized}>
              This is a previously loved item
            </Text>{" "}
            and may exhibit minor cosmetic blemishes from normal use.
          </Text>
          <Text style={styles.detailsSectionContent}>
            Please carefully review the item description, photos, and merchant
            return policy prior to purchase.
          </Text>
        </View>
      </View>
    ) : null;
  }
}

// TODO: some of these should be refactored globally since they're
// shared with other components
const styles = StyleSheet.create({
  detailsSection: {
    marginVertical: Sizes.InnerFrame / 2
  },

  detailsSectionContent: {
    ...Styles.Text,
    marginTop: Sizes.InnerFrame / 2
  },

  detailsAlert: {
    backgroundColor: Colours.Alert,
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame
  }
});
