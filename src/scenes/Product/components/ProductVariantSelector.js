import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
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
  onSelectVariant: stores.productStore.onSelectVariant
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
      isVisible: false,
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
    this.toggle = this.toggle.bind(this);
    this.onSizeSelect = this.onSizeSelect.bind(this);
  }

  toggle(forceShow) {
    this.setState({
      isVisible: forceShow != null ? forceShow : !this.state.isVisible
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
      nextState.size !== this.state.size
      || nextState.color !== this.state.color
      || nextState.isVisible !== this.state.isVisible
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
        size: size,
        isVisible: false
      },
      () =>
        this.props.onSelectVariant(
          this.findVariantWithSelection(size, this.state.color)
        )
    );
  }

  renderSize(size) {
    return (
      <TouchableOpacity
        key={`size-${size}`}
        onPress={() => this.onSizeSelect(size)}>
        <SloppyView>
          <View style={styles.size}>
            <Text style={styles.sizeLabel}>{size}</Text>
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
          onPress={() => this.hasSelectableOptions && this.toggle()}>
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
        {this.state.isVisible ? (
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
    paddingTop: Sizes.InnerFrame + Sizes.InnerFrame / 4,
    paddingBottom: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame,
    backgroundColor: Colours.Foreground
  },

  size: {
    marginRight: Sizes.InnerFrame / 2,
    marginBottom: Sizes.InnerFrame / 4,
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

  placeholder: {
    height: Sizes.OuterFrame
  }
});

export default ProductVariantSelector;
