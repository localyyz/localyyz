import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share
} from "react-native";
import PropTypes from "prop-types";

// custom
//import { applePayButton } from "localyyz/assets";
import { onlyIfLoggedIn, toPriceString } from "localyyz/helpers";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ExplodingButton, SloppyView, PriceTag } from "localyyz/components";
import { capitalize } from "localyyz/helpers";
import { GA } from "localyyz/global";

// third party
import { ApplePayButton } from "react-native-payments";
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

@withNavigation
@inject(stores => ({
  isOnSale:
    stores.productStore.product
    && stores.productStore.product.previousPrice > 0,
  price:
    (stores.productStore.product && stores.productStore.product.price) || 0,
  previousPrice:
    stores.productStore.product && stores.productStore.product.previousPrice,
  discount: stores.productStore.product && stores.productStore.product.discount,
  hasSession: stores.userStore.model.hasSession,
  isExpressSupported: stores.deviceStore.applePaySupported,
  product: stores.productStore.product,
  placeName:
    stores.productStore.product && stores.productStore.product.place.name,
  placeId: stores.productStore.product && stores.productStore.product.place.id,
  selectedVariant: stores.productStore.selectedVariant,
  toggleVariantSelector: forceShow =>
    (stores.productStore.isVariantSelectorVisible
      = forceShow != null
        ? forceShow
        : !stores.productStore.isVariantSelectorVisible),

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
  explode: async () => stores.productStore.toggleAddedSummary(true),
  showNavbar: () => stores.navbarStore.show(),
  hideNavbar: () => stores.navbarStore.hide(),

  // today's deal
  isDeal: !!stores.dealStore,

  // deeplink
  generateProductDeeplink: (
    productID,
    productTitle,
    productDescription,
    isDeal
  ) =>
    stores.productStore.generateProductDeeplink(
      productID,
      productTitle,
      productDescription,
      isDeal
    )
}))
@observer
class ProductBuy extends React.Component {
  static propTypes = {
    selectedVariant: PropTypes.object,
    product: PropTypes.object,

    // mobx injected store props
    hasSession: PropTypes.bool,
    isExpressSupported: PropTypes.bool,
    hideNavbar: PropTypes.func.isRequired,
    showNavbar: PropTypes.func.isRequired,

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
    GA.trackEvent(
      "cart",
      "add to cart - item out of stock",
      String(this.props.product.id)
    );
    Alert.alert(
      "Out of stock",
      "The product with your selected options is currently not in stock",
      [{ text: "OK", onPress: () => this.props.toggleVariantSelector(true) }]
    );
  }

  _onAdd() {
    GA.trackEvent(
      "cart",
      "add to cart - success",
      String(this.props.product.id)
    );
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
          if (response && response.wasSuccessful) {
            this.props.navigation.navigate("CartSummary", response);
          } else if (response && !response.wasAborted) {
            Alert.alert(response.title, response.message, response.buttons);
          }
        });
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

  async shareProduct() {
    await this.props
      .generateProductDeeplink(
        this.props.product.id,
        this.props.product.title,
        this.props.product.description,
        this.props.isDeal
      )
      .then(
        url => {
          Share.share(
            {
              message: this.props.product.title,
              url: url,
              title: "Localyyz"
            },
            {
              // Android only:
              dialogTitle: this.props.product.title,
              // iOS only:
              excludedActivityTypes: []
            }
          );
        },
        () => {
          Alert.alert(
            "Error",
            "Sharing is unavailable at the moment. Please try again later",
            [
              {
                text: "OK",
                onPress: () => {}
              }
            ],
            { cancelable: true }
          );
        }
      );
  }

  render() {
    const { hasSession } = this.props;
    return (
      <View style={styles.container}>
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
        {this.props.isExpressSupported ? (
          <View style={styles.buttons}>
            <TouchableOpacity>
              <ApplePayButton
                width={Sizes.InnerFrame * 10}
                height={Sizes.InnerFrame * 2}
                onPress={() => {
                  this.isInStock
                    ? this._onExpressCheckout()
                    : this.onOutOfStock();
                }}
                style="black"
                type="buy"/>
            </TouchableOpacity>
            {!this.props.isDeal ? (
              <ExplodingButton
                isExploded={this.props.isExploded}
                explode={async () =>
                  this.isInStock
                  && onlyIfLoggedIn(
                    { hasSession },
                    this.props.explode,
                    this.props.navigation
                  )
                }
                shouldExplode={this.props.hasSession && this.isInStock}
                color={Colours.Foreground}
                onPress={() =>
                  this.isInStock ? this._onAdd() : this.onOutOfStock()
                }
                onExplosion={() => {
                  this.props.navigation.setParams({ gesturesEnabled: false });
                  this.props.hideNavbar();
                }}
                onExplosionCleared={() => {
                  this.props.navigation.setParams({ gesturesEnabled: true });
                  this.props.showNavbar();
                }}>
                <View style={styles.button}>
                  <MaterialIcon
                    name="add-shopping-cart"
                    color={Colours.Text}
                    size={Sizes.H3}/>
                </View>
              </ExplodingButton>
            ) : null}
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => {
                this.shareProduct();
              }}>
              <MaterialIcon name="share" color={Colours.Text} size={Sizes.H3} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttons}>
            <ExplodingButton
              navigation={this.props.navigation}
              isExploded={this.props.isExploded}
              explode={async () =>
                this.isInStock && onlyIfLoggedIn(
                  { hasSession },
                  this.props.explode,
                  this.props.navigation
                )
              }
              shouldExplode={this.props.hasSession && this.isInStock}
              color={Colours.MenuBackground}
              onPress={() =>
                this.isInStock ? this._onAdd() : this.onOutOfStock()
              }>
              <View style={styles.expressButton}>
                <MaterialIcon
                  name="add-shopping-cart"
                  color={Colours.AlternateText}
                  size={Sizes.H3}/>
                <Text style={styles.addButtonLabel}>Add to cart</Text>
              </View>
            </ExplodingButton>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => {
                this.shareProduct();
              }}>
              <MaterialIcon name="share" color={Colours.Text} size={Sizes.H3} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    paddingHorizontal: Sizes.InnerFrame
  },

  subtitle: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  previousPrice: {
    textDecorationLine: "line-through"
  },

  buttons: {
    ...Styles.Horizontal,
    marginVertical: Sizes.InnerFrame
  },

  expressButton: {
    ...Styles.Horizontal,
    height: Sizes.InnerFrame * 2,
    width: Sizes.InnerFrame * 10,
    borderRadius: Sizes.InnerFrame * 2 / 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colours.MenuBackground,
    overflow: "hidden"
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    height: Sizes.InnerFrame * 2,
    marginHorizontal: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame * 2 / 3,
    backgroundColor: Colours.Foreground,
    marginRight: Sizes.InnerFrame / 4
  },

  shareButton: {
    alignItems: "center",
    justifyContent: "center",
    height: Sizes.InnerFrame * 2,
    marginHorizontal: Sizes.InnerFrame / 4,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame * 2 / 3,
    backgroundColor: Colours.Foreground
  },

  addButtonLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    marginLeft: Sizes.InnerFrame / 2
  }
});

export default ProductBuy;
