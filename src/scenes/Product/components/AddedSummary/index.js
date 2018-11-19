import React from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import { GA } from "localyyz/global";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { ApplePayButton } from "react-native-payments";
import * as Animatable from "react-native-animatable";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { toPriceString } from "localyyz/helpers";
import Support from "~/src/components/Support";

// local
import { SizeChart } from "../ProductDetails/components";
import ProductVariantSelector from "../ProductVariantSelector";

// constants
const SIZE_APPEAR_INTERVAL = 100;

@inject(stores => ({
  isVisible: stores.productStore.isVariantSelectorVisible,

  // notification on add
  notify: stores.navbarStore.notify,

  // toggles
  closeAddedSummary: () => stores.productStore.toggleAddedSummary(false),
  toggleAddButtons: forceShow =>
    (stores.productStore.isVariantSelectorVisible
      = forceShow != null
        ? forceShow
        : !stores.productStore.isVariantSelectorVisible),

  // regular checkout (add)
  addProduct: stores.cartStore.addProduct,
  product: stores.productStore.product,
  selectedVariant: stores.productStore.selectedVariant,

  // express checkout
  onExpressCheckout: (productId, color, size) =>
    stores.expressCartStore.onExpressCheckout({
      productId: productId,
      color: color,
      size: size
    }),

  // sizes
  isSizeChartSupported:
    stores.productStore.product
    && stores.productStore.product.isSizeChartSupported,
  sizeChartType:
    stores.productStore.product
    && stores.productStore.product.category
    && stores.productStore.product.category.value,

  // data
  sizes:
    (stores.productStore.product
      && stores.productStore.product.associatedSizes.slice())
    || []
}))
@observer
export class AddedSummary extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,

    // mobx injected
    closeAddedSummary: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      isAdded: false,
      addingError: false
    };

    // bindings
    this.onDismiss = this.onDismiss.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onExpressCheckout = this.onExpressCheckout.bind(this);
    this.onOutOfStock = this.onOutOfStock.bind(this);
    this.openSizeChart = this.openSizeChart.bind(this);
  }

  componentDidMount() {
    // allow adding without sizes
    if (
      !this.props.product.associatedSizes
      || this.props.product.associatedSizes.length < 1
    ) {
      this.props.toggleAddButtons(true);
    }
  }

  onDismiss(callback) {
    this.props.toggleAddButtons(false);
    this.props.closeAddedSummary();

    // callback to revert back to cart open on back
    callback && callback();
  }

  async onAdd() {
    let response
      = this.props.product
      && this.props.selectedVariant
      && (await this.props.addProduct({
        product: this.props.product,
        variantId: this.props.selectedVariant.id
      }));

    let errorMessage;

    if (response.error === "Already exists!") {
      errorMessage = "Already added to cart!";
    } else {
      errorMessage = response.error;
    }

    this.setState({ isAdding: true }, () => {
      setTimeout(() => {
        this.setState({
          isAdding: false,
          isAdded: !response.error,
          addingError: errorMessage
        });
      }, 1000);
    });
  }

  onExpressCheckout() {
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

  onOutOfStock() {
    GA.trackEvent(
      "cart",
      "add to cart - item out of stock",
      String(this.props.product.id)
    );
    Alert.alert(
      "Out of stock",
      "The product with your selected options is currently not in stock",
      [{ text: "OK" }]
    );
  }

  openSizeChart() {
    return this.props.navigation.navigate("Modal", {
      type: "size chart",
      title: `${this.props.product.title}`,
      component: <SizeChart type={this.props.sizeChartType} />
    });
  }

  get isInStock() {
    return this.props.selectedVariant && this.props.selectedVariant.limits > 0;
  }

  get title() {
    return this.props.product.associatedSizes.length >= 1
      ? "Select size"
      : "Select purchase method";
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}>
          <View style={styles.helper}>
            <Text style={styles.header}>{this.title}</Text>
            {this.props.isSizeChartSupported ? (
              <TouchableOpacity onPress={this.openSizeChart}>
                <View style={styles.sizeGuide}>
                  <Text style={styles.sizeGuideLabel}>size guide</Text>
                  <MaterialIcon
                    name="help"
                    size={Sizes.Text}
                    color={Colours.AlternateText}/>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
          <ProductVariantSelector sizeAppearInterval={SIZE_APPEAR_INTERVAL} />
          {this.props.isVisible ? (
            <View style={styles.buttons}>
              <Animatable.View
                animation="fadeIn"
                duration={SIZE_APPEAR_INTERVAL * 6}>
                <TouchableOpacity onPress={this.onAdd}>
                  <View>
                    {this.state.isAdding ? (
                      <View
                        style={[
                          styles.addButton,
                          { justifyContent: "center" }
                        ]}>
                        <ActivityIndicator size={"small"} color={"white"} />
                      </View>
                    ) : (
                      <View>
                        {this.state.isAdded ? (
                          <View
                            style={[
                              styles.addButton,
                              { justifyContent: "flex-start" }
                            ]}>
                            <View style={{ paddingRight: Sizes.OuterFrame }}>
                              <MaterialIcon
                                name="check"
                                color={Colours.AlternateText}
                                size={Sizes.H2}
                                style={styles.addButtonIcon}/>
                            </View>
                            <Text style={styles.addButtonLabel}>
                              Added to cart
                            </Text>
                          </View>
                        ) : (
                          <View>
                            {this.state.addingError ? (
                              <View
                                style={[
                                  styles.addButton,
                                  { justifyContent: "flex-start" }
                                ]}>
                                <View
                                  style={{
                                    paddingRight: Sizes.OuterFrame
                                  }}>
                                  <MaterialIcon
                                    name="close"
                                    color={Colours.AlternateText}
                                    size={Sizes.H2}
                                    style={styles.addButtonIcon}/>
                                </View>
                                <Text style={styles.addButtonLabel}>
                                  {this.state.addingError}
                                </Text>
                              </View>
                            ) : (
                              <View style={styles.addButton}>
                                <Text style={styles.addButtonLabel}>
                                  Add to cart
                                </Text>
                                <View style={styles.addButtonDetails}>
                                  <Text style={styles.addButtonLabel}>
                                    {toPriceString(
                                      this.props.selectedVariant.price
                                    )}
                                  </Text>
                                  <MaterialIcon
                                    name="add-shopping-cart"
                                    color={Colours.AlternateText}
                                    size={Sizes.H2}
                                    style={styles.addButtonIcon}/>
                                </View>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animatable.View>
              <Animatable.View
                animation="fadeIn"
                duration={SIZE_APPEAR_INTERVAL * 6}
                delay={SIZE_APPEAR_INTERVAL * 6 / 2}>
                <View style={styles.spacer} />
                <View style={styles.centeredButtons}>
                  <TouchableOpacity>
                    <ApplePayButton
                      width={Sizes.Width / 2}
                      height={Sizes.Width / 10}
                      onPress={() => {
                        this.isInStock
                          ? this.onExpressCheckout()
                          : this.onOutOfStock();
                      }}
                      style="white"
                      type="buy"/>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </View>
          ) : null}
        </ScrollView>
        <View style={styles.footer}>
          <Support
            appearDelay={2500}
            title="Questions? We're here to help."
            textColorTint={Colours.Foreground}/>
        </View>

        <View pointerEvents="box-none" style={styles.close}>
          <MaterialIcon.Button
            name="close"
            size={Sizes.ActionButton}
            underlayColor={Colours.Transparent}
            backgroundColor={Colours.Transparent}
            color={Colours.Foreground}
            onPress={() => this.onDismiss()}/>
        </View>
      </SafeAreaView>
    );
  }
}

export default withNavigation(AddedSummary);

const styles = StyleSheet.create({
  container: {
    ...Styles.Overlay,
    backgroundColor: Colours.DarkTransparent
  },

  close: {
    position: "absolute",
    top: 5 + Sizes.ScreenTop,
    left: 5
  },

  helper: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginRight: Sizes.InnerFrame / 2
  },

  content: {
    marginHorizontal: Sizes.InnerFrame,
    marginTop: 5 + Sizes.ScreenTop + Sizes.OuterFrame,
    paddingBottom: Sizes.Height / 4
  },

  footer: {
    bottom: 0
  },

  header: {
    ...Styles.Text,
    ...Styles.Title,
    ...Styles.Alternate
  },

  addButton: {
    ...Styles.RoundedButton,
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.OuterFrame / 2,
    borderRadius: Sizes.OuterFrame,
    backgroundColor: Colours.Accented
  },

  addButtonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  addButtonDetails: {
    ...Styles.Horizontal
  },

  addButtonIcon: {
    marginLeft: Sizes.InnerFrame / 2
  },

  centeredButtons: {
    alignItems: "center"
  },

  spacer: {
    height: Sizes.Spacer,
    backgroundColor: Colours.LightShadow,
    marginVertical: Sizes.InnerFrame,
    marginHorizontal: Sizes.InnerFrame
  },

  sizeGuide: {
    ...Styles.Horizontal
  },

  sizeGuideLabel: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Alternate,
    ...Styles.Underlined,
    marginRight: Sizes.InnerFrame / 3
  }
});
