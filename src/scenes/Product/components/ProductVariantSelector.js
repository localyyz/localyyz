import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { SloppyView } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { inject } from "mobx-react";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

@inject(stores => ({
  product: stores.productStore.product,
  onSelectVariant: stores.productStore.onSelectVariant,
  isVisible: stores.productStore.isVariantSelectorVisible,
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

    // TODO: verify product has variants
    const { product } = props;
    this.state = {
      color:
        product && product.colors && product.colors.length > 0
          ? product.colors[0]
          : null,
      size:
        product && product.sizes && product.sizes.length > 0
          ? product.sizes[0]
          : null
    };

    // bindings
    this.findVariantWithSelection = this.findVariantWithSelection.bind(this);
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

  componentDidUpdate() {
    // as if an network call, sync up the variant to other
    // components in the localyyz universe
    this.props.onSelectVariant(
      this.findVariantWithSelection(this.state.size, this.state.color)
    );
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  findVariantWithSelection(size, color) {
    let variant = this.props.product.variants.find(
      variant => variant.etc.color === color && variant.etc.size === size
    );

    if (!variant && color) {
      variant = this.props.product.variants.find(
        variant => variant.etc.color === color
      );
    } else if (!variant && size) {
      variant = this.props.product.variants.find(
        variant => variant.etc.size === size
      );
    } else if (!!this.props.product.variants && !size && !color) {
      variant = this.props.product.variants[0];
    }

    // cache the result
    return variant;
  }

  onSizeSelect(size) {
    this.setState(
      {
        size: size
      },
      () => {
        this.props.onSelectVariant(
          this.findVariantWithSelection(size, this.state.color)
        );
        this.props.toggle(false);
      }
    );
  }

  alertOos() {
    Alert.alert(
      "Size out of stock",
      "Please try again later or try a different size"
    );
  }

  renderSize(size) {
    let variant = this.findVariantWithSelection(size, this.state.color);
    return (
      <TouchableOpacity
        key={`size-${size}`}
        onPress={() =>
          variant.limits > 0 ? this.onSizeSelect(size) : this.alertOos()
        }>
        <SloppyView>
          <View style={styles.size}>
            <Text
              style={[
                styles.sizeLabel,
                variant.limits <= 0 && styles.oosLabel
              ]}>
              {size}
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
    );
  }

  get hasSelectableOptions() {
    return (
      this.props.product
      && this.props.product.sizes
      && this.props.product.sizes.length > 1
    );
  }

  render() {
    let variant = this.findVariantWithSelection(
      this.state.size,
      this.state.color
    ) || { description: "one size" };

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.hasSelectableOptions && this.props.toggle()}>
          <SloppyView>
            <View style={styles.selected}>
              <Text numberOfLines={1} style={styles.selectedLabel}>
                <Text style={styles.selectedLabelHeader}>Size:</Text>
                <Text>{"  "}</Text>
                <Text style={styles.selectedLabelContent}>
                  {variant.description}
                </Text>
                <Text>{"  "}</Text>
              </Text>
              {this.hasSelectableOptions ? (
                <MaterialIcon
                  name="keyboard-arrow-down"
                  color={Colours.Text}
                  size={Sizes.TinyText}/>
              ) : null}
            </View>
          </SloppyView>
        </TouchableOpacity>
        {this.props.isVisible ? (
          <Animatable.View
            animation="fadeInUp"
            duration={200}
            style={styles.dropdown}>
            {this.props.product.sizes.map(size => this.renderSize(size))}
          </Animatable.View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  selected: {
    ...Styles.Horizontal,
    marginBottom: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.OuterFrame
  },

  selectedLabel: {
    ...Styles.Text
  },

  selectedLabelHeader: {
    ...Styles.TinyText
  },

  selectedLabelContent: {
    textDecorationLine: "underline"
  },

  dropdown: {
    ...Styles.Horizontal,
    flexWrap: "wrap",
    paddingTop: Sizes.InnerFrame + Sizes.InnerFrame / 2,
    paddingBottom: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame,
    backgroundColor: Colours.Foreground
  },

  size: {
    ...Styles.Horizontal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Sizes.InnerFrame / 2,
    marginBottom: Sizes.InnerFrame / 2,
    paddingVertical: Sizes.InnerFrame / 4,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.Background
  },

  sizeLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText
  },

  oosLabel: {
    ...Styles.Subdued
  },

  oosIcon: {
    marginLeft: Sizes.InnerFrame / 4
  },

  placeholder: {
    height: Sizes.OuterFrame
  }
});

export default ProductVariantSelector;
