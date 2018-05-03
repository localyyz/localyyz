import React from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";

// custom
import { OptionsBar } from "localyyz/components";

class ProductVariantSelector extends React.Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(
      nextState.size !== this.state.size || nextState.color !== this.state.color
    );
  }

  componentDidUpdate() {
    // as if an network call, sync up the variant to other
    // components in the localyyz universe
    this.props.onSelect(
      this.findVariantWithSelection(this.state.size, this.state.color)
    );
  }

  componentDidMount() {
    // as if an network call, sync up the variant to other
    // components in the localyyz universe
    this.props.onSelect(
      this.findVariantWithSelection(this.state.size, this.state.color)
    );
  }

  findVariantWithSelection = (size, color) => {
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
  };

  render() {
    const { product } = this.props;

    return (
      <View style={styles.optionsContentContainer}>
        <OptionsBar
          options={product.sizes}
          onUpdate={size =>
            this.setState({
              size: size
            })
          }/>
        <OptionsBar
          options={product.colors}
          onUpdate={color =>
            this.setState({
              color: color
            })
          }/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  optionsContentContainer: {
    flex: 1,
    flexDirection: "column"
  }
});

export default ProductVariantSelector;
