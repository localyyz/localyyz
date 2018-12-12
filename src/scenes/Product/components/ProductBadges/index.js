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
          <View>
            <Badge
              name={"local-shipping"}
              size={Sizes.BadgeIcon}
              color={Colours.Foreground}
              label={"Free U.S. Shipping"}/>
          </View>
        ) : null}
        {this.props.product.hasFreeReturn ? (
          <View>
            <Badge
              name={"keyboard-return"}
              size={Sizes.BadgeIcon}
              color={Colours.Foreground}
              label={"Free Returns"}/>
          </View>
        ) : null}
        {this.isOnSale ? (
          <View>
            <Badge
              name={"money-off"}
              size={Sizes.BadgeIcon}
              color={Colours.Foreground}
              label={"On Sale"}/>
          </View>
        ) : null}
        {this.hasLowStock ? (
          <View>
            <Badge
              name={"priority-high"}
              size={Sizes.BadgeIcon}
              color={Colours.Foreground}
              label={"Low Stock"}/>
          </View>
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
    justifyContent: "space-around",
    paddingVertical: 2 * Sizes.InnerFrame / 3,
    paddingHorizontal: Sizes.InnerFrame / 2
  }
});
