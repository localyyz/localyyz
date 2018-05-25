import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ReactiveSpacer } from "localyyz/components";
import { NAVBAR_HEIGHT } from "../../components/NavBar";

// third party
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// local component
import {
  ProductBuy,
  ProductVariantSelector,
  RelatedProducts,
  ProductDetails,
  MerchantDetails,
  Photos
} from "./components";

@withNavigation
@inject(stores => ({
  coverImage:
    stores.productStore.product && stores.productStore.product.imageUrl,
  backgroundPosition: stores.uiStore.backgroundPosition,
  product: stores.productStore.product
}))
@observer
export default class Content extends React.Component {
  static propTypes = {
    backgroundPosition: PropTypes.number,
    product: PropTypes.object.isRequired,
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
        <TouchableWithoutFeedback
          onPress={() => this.props.onPressImage(this.props.coverImage)}>
          <View>
            <ReactiveSpacer
              store={this.props}
              heightProp="backgroundPosition"/>
            <LinearGradient
              colors={[Colours.Transparent, Colours.Background]}
              style={styles.optionsContainer}>
              <LinearGradient
                colors={[
                  Colours.Transparent,
                  Colours.Transparent,
                  Colours.Background
                ]}
                style={styles.optionsGradient}
                start={{ y: 0, x: 1 }}
                end={{ y: 1, x: 0 }}>
                <ProductBuy />
                <ProductVariantSelector />
              </LinearGradient>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.card, styles.firstCard]}>
          <ProductDetails />
        </View>
        <Photos onPress={this.props.onPressImage} />
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

  // content area
  card: {
    ...Styles.Card,
    marginVertical: Sizes.InnerFrame / 8
  },

  firstCard: {
    marginVertical: null,
    marginBottom: Sizes.InnerFrame / 8
  },

  // options
  optionsGradient: {
    paddingTop: Sizes.OuterFrame
  }
});
