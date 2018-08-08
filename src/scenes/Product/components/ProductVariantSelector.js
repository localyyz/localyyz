import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { SloppyView } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { inject } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

// constants
const DEFAULT_SIZE_APPEAR_INTERVAL = 100;

@inject(stores => ({
  product: stores.productStore.product,
  onSelectVariant: stores.productStore.onSelectVariant,
  toggle: forceShow =>
    (stores.productStore.isVariantSelectorVisible
      = forceShow != null
        ? forceShow
        : !stores.productStore.isVariantSelectorVisible)
}))
class ProductVariantSelector extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    onSelectVariant: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    let defaultVariant
      = this.props.product && this.props.product.selectedVariant;

    this.state = {
      color: defaultVariant.etc && defaultVariant.etc.color
    };

    // bindings
    this.renderSize = this.renderSize.bind(this);
    this.onSizeSelect = this.onSizeSelect.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
      nextState.size !== this.state.size
      || nextState.color !== this.state.color
      || nextProps.isVisible !== this.props.isVisible
    );
  }

  componentDidMount() {
    // select first size if only one size available
    this.props.product.associatedSizes.length == 1
      && this.onSizeSelect(this.props.product.associatedSizes[0]);
  }

  componentDidUpdate() {
    // as if an network call, sync up the variant to other
    // components in the localyyz universe
    this.props.product
      && this.props.onSelectVariant(
        this.props.product.getVariant(this.state.size, this.state.color)
          || this.props.product.selectedVariant
      );
  }

  onSizeSelect(size) {
    this.setState(
      {
        size: size
      },
      () => {
        this.props.onSelectVariant(
          this.props.product.getVariant(size, this.state.color)
        );
        this.props.toggle(true);
      }
    );
  }

  alertOos() {
    Alert.alert(
      "Size out of stock",
      "Please try again later or try a different size"
    );
  }

  renderSize(size, i = 0) {
    let variant = this.props.product.getVariant(size, this.state.color);
    let isSelected = size === this.state.size;

    return variant ? (
      <Animatable.View
        key={`size-${size}-${i}`}
        animation="fadeInRight"
        duration={
          (this.props.sizeAppearInterval || DEFAULT_SIZE_APPEAR_INTERVAL) * 3
        }
        delay={
          (this.props.sizeAppearInterval || DEFAULT_SIZE_APPEAR_INTERVAL) * i
        }>
        <TouchableOpacity
          key={`size-${size}`}
          onPress={() =>
            variant.limits > 0 ? this.onSizeSelect(size) : this.alertOos()
          }>
          <SloppyView>
            <View style={[styles.size, isSelected && styles.selected]}>
              <Text
                style={[
                  styles.sizeLabel,
                  variant.limits <= 0 && styles.oosLabel,
                  isSelected && styles.selectedLabel
                ]}>
                {`${size}`.toUpperCase()}
              </Text>
              {variant.limits <= 0 ? (
                <MaterialIcon
                  name="block"
                  color={Colours.SubduedText}
                  size={Sizes.TinyText}
                  style={styles.oosIcon}/>
              ) : null}
            </View>
          </SloppyView>
        </TouchableOpacity>
      </Animatable.View>
    ) : null;
  }

  get hasSelectableOptions() {
    return (
      this.props.product
      && this.props.product.associatedSizes
      && this.props.product.associatedSizes.length > 1
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.product.associatedSizes
          .filter(
            size =>
              this.props.product.getVariant(size, this.state.color).limits > 0
          )
          .map((size, i) => this.renderSize(size, i))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    flexWrap: "wrap",
    marginVertical: Sizes.InnerFrame / 2
  },

  size: {
    ...Styles.Horizontal,
    ...Styles.RoundedButton,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Sizes.InnerFrame / 2,
    marginBottom: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.OuterFrame,
    borderWidth: 1,
    borderColor: Colours.AlternateText,
    backgroundColor: Colours.Transparent
  },

  sizeLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate
  },

  selected: {
    backgroundColor: Colours.AlternateText
  },

  selectedLabel: {
    color: Colours.Text
  }
});

export default ProductVariantSelector;
