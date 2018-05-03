import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import PropTypes from "prop-types";

// custom
import { applePayButton } from "localyyz/assets";
import { onlyIfLoggedIn, toPriceString } from "localyyz/helpers";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { UppercasedText, ExplodingButton } from "localyyz/components";

// third party
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";

@withNavigation
@inject(stores => ({
  hasSession: stores.userStore.model.hasSession,
  isExpressSupported: stores.deviceStore.applePaySupported,
  product: stores.productStore.product,
  selectedVariant: stores.productStore.selectedVariant,

  // regular checkout (add)
  onAdd: (productId, color, size) =>
    stores.cartStore.addItem({
      productId: productId,
      color: color,
      size: size
    }),

  // express checkout
  onExpressCheckout: (productId, color, size) =>
    stores.cartStore.onExpressCheckout({
      productId: productId,
      color: color,
      size: size
    }),

  // added summary mobx exploder
  isExploded: stores.productStore.isAddedSummaryVisible,
  explode: async () => stores.productStore.toggleAddedSummary(true)
}))
@observer
class ProductBuy extends React.Component {
  static propTypes = {
    selectedVariant: PropTypes.object,
    product: PropTypes.object,

    // mobx injected store props
    hasSession: PropTypes.bool,
    isExpressSupported: PropTypes.bool,

    // checkout from mobx
    onAdd: PropTypes.func.isRequired,
    onExpressCheckout: PropTypes.func.isRequired
  };

  static defaultProps = {
    hasSession: false,
    isExpressSupported: false
  };

  constructor(props) {
    super(props);

    // bindings
    this.onOutOfStock = this.onOutOfStock.bind(this);
    this._onAdd = this._onAdd.bind(this);
    this._onExpressCheckout = this._onExpressCheckout.bind(this);
  }

  onOutOfStock() {
    Alert.alert(
      "Out of stock",
      "The product with your selected options is currently not in stock"
    );
  }

  _onAdd() {
    this.props.product
      && this.props.selectedVariant
      && this.props.onAdd(
        this.props.product.id,
        this.props.selectedVariant.etc.color,
        this.props.selectedVariant.etc.size
      );
  }

  _onExpressCheckout() {
    this.props.product
      && this.props.selectedVariant
      && this.props
        .onExpressCheckout(
          this.props.product.id,
          this.props.selectedVariant.etc.color,
          this.props.selectedVariant.etc.size
        )
        .then(response => {
          // handle response with ui presentation
          if (response && response.wasSuccessful) {
            this.props.navigation.navigate("CartSummary", response);
          } else if (response && !response.wasAborted) {
            Alert.alert(response.title, response.message, response.buttons);
          }
        });
  }

  render() {
    const { selectedVariant, hasSession, navigation } = this.props;

    const isStockAvailable = selectedVariant && selectedVariant.limits > 0;
    const shouldExplode = hasSession && isStockAvailable;

    // if one of them wasn't found, check with only one of them
    let { price, prevPrice } = selectedVariant || {};
    price = price || 0;
    prevPrice = prevPrice || 0;

    return (
      <View style={styles.addGroup}>
        <View style={styles.priceContainer}>
          <View style={Styles.Horizontal}>
            {!!prevPrice
              && prevPrice > 0 && (
                <Text style={[styles.price, styles.prevPrice]}>
                  {`${prevPrice.toFixed(2)}`}
                </Text>
              )}
            <Text style={styles.price}>
              {toPriceString(price, this.props.product.place.currency)}
            </Text>
          </View>
        </View>
        {this.props.isExpressSupported ? (
          <View>
            <TouchableOpacity
              onPress={() =>
                isStockAvailable
                  ? this._onExpressCheckout()
                  : this.onOutOfStock()
              }>
              <View style={styles.expressButton}>
                <Image
                  resizeMode="contain"
                  style={styles.expressButtonLogo}
                  source={applePayButton}/>
              </View>
            </TouchableOpacity>
            <ExplodingButton
              isExploded={this.props.isExploded}
              explode={async () =>
                onlyIfLoggedIn({ hasSession }, this.props.explode, navigation)
              }
              shouldExplode={shouldExplode}
              color={Colours.PositiveButton}
              onPress={() =>
                isStockAvailable ? this._onAdd() : this.onOutOfStock()
              }>
              <Text style={styles.addButtonWithExpressLabel}>
                .. or add to cart
              </Text>
            </ExplodingButton>
          </View>
        ) : (
          <ExplodingButton
            isExploded={this.props.isExploded}
            explode={async () =>
              onlyIfLoggedIn({ hasSession }, this.props.explode, navigation)
            }
            shouldExplode={shouldExplode}
            color={Colours.PositiveButton}
            onPress={() =>
              isStockAvailable ? this._onAdd() : this.onOutOfStock()
            }>
            <View style={Styles.RoundedButton}>
              <UppercasedText style={styles.addButtonLabel}>
                add to cart
              </UppercasedText>
            </View>
          </ExplodingButton>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addButtonLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  addGroup: {
    alignItems: "center"
  },

  addButtonWithExpressLabel: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Underlined,
    paddingVertical: Sizes.InnerFrame / 2
  },

  expressButton: {
    marginVertical: Sizes.InnerFrame / 2,
    height: Sizes.InnerFrame * 2,
    width: Sizes.InnerFrame * 10,
    borderRadius: Sizes.InnerFrame * 2 / 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.MenuBackground,
    overflow: "hidden"
  },

  expressButtonLogo: {
    height: "70%",
    tintColor: Colours.AlternateText
  },

  priceContainer: {
    alignItems: "flex-end"
  },

  price: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.Emphasized
  },

  prevPrice: {
    ...Styles.Subdued,
    fontWeight: "100",
    textDecorationLine: "line-through",
    marginRight: Sizes.InnerFrame / 2
  }
});

export default ProductBuy;
