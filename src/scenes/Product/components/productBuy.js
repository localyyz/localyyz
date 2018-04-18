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
import { onlyIfLoggedIn } from "localyyz/helpers";
import { Colours, Sizes, Styles } from "localyyz/constants";
import { UppercasedText, ExplodingButton } from "localyyz/components";
import { facebook as Facebook } from "localyyz/effects";

// third party
import { inject, observer } from "mobx-react/native";
import getSymbolFromCurrency from "currency-symbol-map";

@inject(stores => ({
  hasSession: stores.userStore.model.hasSession,
  isExpressSupported: true
}))
@observer
class ProductBuy extends React.Component {
  static propTypes = {
    variant: PropTypes.object,
    onExpressCheckout: PropTypes.func,
    onAddtoCart: PropTypes.func,
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
    this.reset = this.reset.bind(this);
  }

  reset() {
    // called from the parent component and passed down to ExplodingButton
    //
    // TODO: move this to a state -> props update. you shouldnt have refs being
    // referred to from parent down to grand children... please refactor
    this.refs.exploder && this.refs.exploder.reset();
  }

  onOutOfStock() {
    Alert.alert(
      "Out of stock",
      "The product with your selected options is currently not in stock"
    );
  }

  _onExpressCheckout = () => {
    Facebook.logEvent("fb_mobile_express_pay", {
      fb_content_type: "apple_pay",
      fb_content: true
    });
    this.props.onExpressCheckout && this.props.onExpressCheckout();
  };

  render() {
    const { variant, hasSession, onAddtoCart, navigation } = this.props;

    const isStockAvailable = variant && variant.limits > 0;
    const shouldExplode = hasSession && isStockAvailable;

    // if one of them wasn't found, check with only one of them
    let { price, prevPrice } = variant || {};
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
              {`${getSymbolFromCurrency(this.props.product.place.currency)
                || "$"}${price.toFixed(2)} ${
                this.props.product ? this.props.product.place.currency : "USD"
              }`}
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
              ref="exploder"
              shouldExplode={shouldExplode}
              color={Colours.PositiveButton}
              navigation={navigation}
              onPress={() =>
                isStockAvailable
                  ? onlyIfLoggedIn({ hasSession }, onAddtoCart, navigation)
                  : this.onOutOfStock()
              }>
              <Text style={styles.addButtonWithExpressLabel}>
                .. or add to cart
              </Text>
            </ExplodingButton>
          </View>
        ) : (
          <ExplodingButton
            ref="exploder"
            shouldExplode={shouldExplode}
            color={Colours.PositiveButton}
            navigation={navigation}
            onPress={() =>
              isStockAvailable
                ? onlyIfLoggedIn({ hasSession }, onAddtoCart, navigation)
                : this.onOutOfStock()
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
