import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";

// custom
//import { applePayButton } from "localyyz/assets";
import { toPriceString } from "localyyz/helpers";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { SloppyView, PriceTag } from "localyyz/components";
import { capitalize } from "localyyz/helpers";

// third party
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

@inject(stores => ({
  isOnSale:
    stores.productStore.product
    && stores.productStore.product.previousPrice > 0,
  previousPrice:
    stores.productStore.product && stores.productStore.product.previousPrice,
  discount: stores.productStore.product && stores.productStore.product.discount,
  hasSession: stores.userStore.model.hasSession,
  isExpressSupported: stores.deviceStore.applePaySupported,
  product: stores.productStore.product,
  placeName:
    stores.productStore.product && stores.productStore.product.place.name,
  placeId: stores.productStore.product && stores.productStore.product.place.id,

  // variants
  selectedVariant: stores.productStore.selectedVariant,
  onSelectVariant: stores.productStore.onSelectVariant,

  // added summary mobx exploder
  openAddSummary: async () => stores.productStore.toggleAddedSummary(true),

  // today's deal
  isDeal: !!stores.dealStore
}))
@observer
export class ProductBuy extends React.Component {
  static propTypes = {
    selectedVariant: PropTypes.object,
    product: PropTypes.object,

    // mobx injected store props
    hasSession: PropTypes.bool,
    isExpressSupported: PropTypes.bool
  };

  static defaultProps = {
    hasSession: false,
    isExpressSupported: false
  };

  constructor(props) {
    super(props);

    // bindings
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.isInStock && this.props.openAddSummary();
  }

  get isInStock() {
    return this.props.selectedVariant && this.props.selectedVariant.limits > 0;
  }

  get productListParams() {
    return this.props.product.brand
      ? {
          fetchPath: `designers/${this.props.product.brand.toLowerCase()}/products`,
          title: capitalize(this.props.product.brand)
        }
      : {
          fetchPath: `places/${this.props.placeId}/products`,
          title: capitalize(this.props.placeName)
        };
  }

  get buttonLabel() {
    return this.isInStock ? "Add to cart" : "Out of stock";
  }

  get buttonIcon() {
    return this.isInStock ? "add-shopping-cart" : "error";
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.details}>
          <PriceTag size={Sizes.H1} product={this.props.product} />
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate(
                "ProductList",
                this.productListParams
              )
            }>
            <SloppyView>
              <Text numberOfLines={1} style={styles.subtitle}>
                {this.props.isOnSale ? (
                  <Text>
                    <Text style={styles.previousPrice}>
                      {toPriceString(
                        this.props.previousPrice,
                        this.props.product.place.currency
                      )}
                    </Text>
                    <Text> · </Text>
                  </Text>
                ) : null}

                <Text style={styles.brand}>
                  {this.props.product.brand || this.props.placeName}
                </Text>
              </Text>
            </SloppyView>
          </TouchableOpacity>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity onPress={this.onPress}>
            <View style={styles.button}>
              <MaterialIcon
                name={this.buttonIcon}
                color={Colours.AlternateText}
                size={Sizes.Text}/>
              <Text style={styles.addButtonLabel}>{this.buttonLabel}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withNavigation(ProductBuy);

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.OuterFrame
  },

  subtitle: {
    ...Styles.Text,
    ...Styles.SmallText,
    marginTop: Sizes.InnerFrame / 4
  },

  previousPrice: {
    textDecorationLine: "line-through"
  },

  button: {
    ...Styles.Horizontal,
    height: Sizes.InnerFrame * 2,
    width: Sizes.InnerFrame * 10,
    borderRadius: Sizes.InnerFrame * 2 / 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.MenuBackground,
    overflow: "hidden"
  },

  addButtonLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    marginLeft: Sizes.InnerFrame / 2
  },

  details: {
    flex: 1,
    alignItems: "flex-start",
    marginRight: Sizes.InnerFrame
  }
});
