import React from "react";

import { View, StyleSheet } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";

// third party
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";

// local
import Badge from "./Badge";

@inject(stores => ({
  product: stores.productStore.product,
  discount: stores.productStore.product && stores.productStore.product.discount,
  stock:
    stores.productStore.product && stores.productStore.product.associatedStock
}))
@observer
export class Index extends React.Component {
  get isOnSale() {
    return this.props.discount > 0.1;
  }

  get hasLowStock() {
    return this.props.stock < 20;
  }

  render() {
    return (
      <View style={styles.iconContainer}>
        {this.props.product.hasFreeShipping ? (
          <Badge
            name={"local-shipping"}
            size={Sizes.BadgeIcon}
            color={Colours.Foreground}
            label={"Free U.S. Shipping"}/>
        ) : null}
        {this.props.product.hasFreeReturn ? (
          <Badge
            name={"keyboard-return"}
            size={Sizes.BadgeIcon}
            color={Colours.Foreground}
            label={"Free Returns"}/>
        ) : null}
        {this.isOnSale ? (
          <Badge
            name={"money-off"}
            size={Sizes.BadgeIcon}
            color={Colours.Foreground}
            label={"On Sale"}/>
        ) : null}
        {this.hasLowStock ? (
          <Badge
            name={"priority-high"}
            size={Sizes.BadgeIcon}
            color={Colours.Foreground}
            label={"Low Stock"}/>
        ) : null}
      </View>
    );
  }
}

export default withNavigation(Index);

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colours.Foreground,
    flexDirection: "row",
    alignItems: "center"
  }
});
