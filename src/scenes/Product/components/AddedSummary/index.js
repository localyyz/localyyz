import React from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { ApplePayButton } from "react-native-payments";
import * as Animatable from "react-native-animatable";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import Support from "~/src/components/Support";

// local
import SizeChart from "./SizeChart";
import SizeSelector from "./SizeSelector";

import ConfirmAddToCartButton from "./ConfirmAddToCartButton";

// constants
const SIZE_APPEAR_INTERVAL = 100;

@inject(stores => ({
  // toggles
  closeAddedSummary: () => stores.productStore.toggleAddedSummary(false),

  // regular checkout (add)
  addProduct: stores.cartStore.addProduct,
  product: stores.productStore.product,
  selectedVariant: stores.productStore.selectedVariant,
  onSelectSize: stores.productStore.onSelectSize,

  // express checkout
  onExpressCheckout: (productId, color, size) =>
    stores.expressCartStore.onExpressCheckout({
      productId: productId,
      color: color,
      size: size
    }),

  // data
  associatedSizes: stores.productStore.associatedSizes.slice(),
  selectedSize: stores.productStore.selectedSize
}))
@observer
export class AddedSummary extends React.Component {
  static propTypes = {
    // mobx injected
    closeAddedSummary: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      // can add to cart? no sizes to select or default/already selected
      canAddToCart: props.selectedSize || !props.associatedSizes
    };
  }

  onExpressCheckout = () => {
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
  };

  openSizeChart = () => {
    // sizes
    const sizeChartType
      = this.props.product.category && this.props.product.category.value;

    return this.props.navigation.navigate("Modal", {
      type: "size chart",
      title: `${this.props.product.title}`,
      component: <SizeChart type={sizeChartType} />
    });
  };

  get isInStock() {
    return this.props.selectedVariant && this.props.selectedVariant.limits > 0;
  }

  get title() {
    return this.props.associatedSizes.length >= 1
      ? "Select size"
      : "Select purchase method";
  }

  onDismiss = () => {
    this.props.navigation.setParams({ hideHeader: false });
    this.props.closeAddedSummary();
  };

  get renderAddToCart() {
    return (
      <View style={styles.buttons}>
        <Animatable.View animation="fadeIn" duration={SIZE_APPEAR_INTERVAL * 6}>
          <ConfirmAddToCartButton />
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
                onPress={() => this.onExpressCheckout()}
                style="white"
                type="buy"/>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  }

  onSelectSize = size => {
    this.setState({ canAddToCart: true }, () => {
      this.props.onSelectSize(size);
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}>
          <View style={styles.helper}>
            <Text style={styles.header}>{this.title}</Text>
            <TouchableOpacity onPress={this.openSizeChart}>
              <View style={styles.sizeGuide}>
                <Text style={styles.sizeGuideLabel}>size guide</Text>
                <MaterialIcon
                  name="help"
                  size={Sizes.Text}
                  color={Colours.AlternateText}/>
              </View>
            </TouchableOpacity>
          </View>
          <SizeSelector
            selectedSize={this.props.selectedSize}
            onSelectSize={this.onSelectSize}
            sizeAppearInterval={SIZE_APPEAR_INTERVAL}/>
          {this.state.canAddToCart ? this.renderAddToCart : null}
        </ScrollView>

        <View style={styles.footer}>
          <Support
            appearDelay={2500}
            title="Questions? We're here to help."
            textColorTint={Colours.Foreground}/>
        </View>

        <View style={styles.close}>
          <MaterialIcon.Button
            name="close"
            size={Sizes.ActionButton}
            underlayColor={Colours.Transparent}
            backgroundColor={Colours.Transparent}
            color={Colours.Foreground}
            onPress={() => {
              this.onDismiss();
            }}/>
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
    top: 0,
    left: 0,

    paddingLeft: 5,
    paddingTop: 5 + Sizes.ScreenTop
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
