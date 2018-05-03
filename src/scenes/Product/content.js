import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { NAVBAR_HEIGHT } from "../../components/NavBar";

// third party
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";

// local component
import {
  ImageCarousel,
  ProductBuy,
  ProductVariantSelector,
  RelatedProducts,
  ProductDetails,
  MerchantDetails
} from "./components";

export default class Content extends React.Component {
  static propTypes = {
    backgroundPosition: PropTypes.number,
    product: PropTypes.object.isRequired,
    onSelectVariant: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
    onPressImage: PropTypes.func.isRequired
  };

  static defaultProps = {
    backgroundPosition: 0
  };

  constructor(props) {
    super(props);

    // refs
    this.contentScrollViewRef = React.createRef();
  }

  componentDidMount() {
    // trigger rendering image hack/fix
    // https://github.com/facebook/react-native/issues/1831#issuecomment-231069668
    this.timer = setTimeout(() => {
      this.contentScrollViewRef.current
        && this.contentScrollViewRef.current.scrollTo({ y: 1 });
    }, 10);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.backgroundPosition !== this.props.backgroundPosition) {
      return true;
    }
    return false;
  }

  get productId() {
    return this.props.product
      ? this.props.product.id
      : this.props.navigation.state.params.productId;
  }

  render() {
    return (
      <ScrollView
        ref={this.contentScrollViewRef}
        contentContainerStyle={styles.productContainer}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={this.props.onScroll}>
        <LinearGradient
          colors={[Colours.Transparent, Colours.Background]}
          style={[
            styles.optionsContainer,
            {
              marginTop: this.props.backgroundPosition
            }
          ]}>
          <ProductVariantSelector
            product={this.props.product}
            onSelect={this.props.onSelectVariant}/>
          <ProductBuy />
        </LinearGradient>
        <View style={styles.carousel}>
          <ImageCarousel onPress={this.props.onPressImage} />
        </View>
        <View style={styles.card}>
          <ProductDetails />
        </View>
        <View style={styles.card}>
          <MerchantDetails />
        </View>
        <RelatedProducts />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  productContainer: {
    paddingBottom: NAVBAR_HEIGHT + Sizes.OuterFrame
  },

  carousel: {
    marginBottom: Sizes.OuterFrame
  },

  // content area
  card: {
    ...Styles.Card,
    marginVertical: Sizes.InnerFrame / 8
  },

  // options
  optionsContainer: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame
  }
});
