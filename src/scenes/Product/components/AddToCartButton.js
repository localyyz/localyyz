import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { Colours, Sizes, Styles } from "localyyz/constants";
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";

import { SloppyView } from "localyyz/components";
import { NAVBAR_HEIGHT } from "../../../constants";

@inject(stores => ({
  product: stores.productStore.product,
  selectedVariant: stores.productStore.selectedVariant,

  openAddSummary: async () => stores.productStore.toggleAddedSummary(true)
}))
@observer
export class AddToCartButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onPress() {
    this.isInStock && this.props.openAddSummary();
  }

  get isInStock() {
    return this.props.selectedVariant && this.props.selectedVariant.limits > 0;
  }

  get isOneSize() {
    return this.props.product && this.props.product.isOneSize;
  }

  get buttonLabel() {
    return this.isInStock
      ? this.isOneSize ? "Add to Cart" : "Select Size"
      : "Out of stock";
  }

  get buttonIcon() {
    return this.isInStock ? "add-shopping-cart" : "error";
  }

  render() {
    return (
      <View style={styles.buttons}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            this.onPress();
          }}>
          <SloppyView style={styles.button}>
            <MaterialIcon
              name={this.buttonIcon}
              color={Colours.AlternateText}
              size={Sizes.H2}/>
            <Text style={styles.addButtonLabel}>{this.buttonLabel}</Text>
          </SloppyView>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(AddToCartButton);

const styles = StyleSheet.create({
  button: {
    ...Styles.Horizontal,
    height: NAVBAR_HEIGHT,
    paddingBottom: Sizes.ScreenBottom,
    width: Sizes.Width,
    justifyContent: "center",
    backgroundColor: Colours.Accented
  },

  addButtonLabel: {
    ...Styles.Alternate,
    fontSize: Sizes.H2,
    letterSpacing: 0.8,
    fontWeight: Sizes.Bold,
    marginLeft: Sizes.InnerFrame / 2
  }
});
