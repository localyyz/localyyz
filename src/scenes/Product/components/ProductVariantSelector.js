import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { SloppyView } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { inject } from "mobx-react/native";
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
    let defaultVariant
      = this.props.product && this.props.product.selectedVariant;
    this.state = {
      color: defaultVariant.etc && defaultVariant.etc.color,
      size: defaultVariant.etc && defaultVariant.etc.size
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

  componentDidUpdate() {
    // as if an network call, sync up the variant to other
    // components in the localyyz universe
    this.props.product
      && this.props.onSelectVariant(
        this.props.product.getVariant(this.state.size, this.state.color)
          || this.props.product.defaultVariant
      );
  }

  componentDidMount() {
    this.componentDidUpdate();
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
    let variant = this.props.product.getVariant(size, this.state.color);
    return variant ? (
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
    ) : null;
  }

  get hasSelectableOptions() {
    return (
      this.props.product
      && this.props.product.sizes
      && this.props.product.sizes.length > 1
    );
  }

  render() {
    let variant = (this.props.product
      && this.props.product.getVariant(this.state.size, this.state.color)) || {
      etc: { size: "one size" }
    };

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
                  {variant.etc.size || "one size"}
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
    paddingHorizontal: Sizes.InnerFrame
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
