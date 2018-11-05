import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Text
} from "react-native";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";
import { ReactiveSpacer } from "localyyz/components";
import Favourite from "~/src/components/ProductTileV2/Favourite";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// third party
import PropTypes from "prop-types";
import LinearGradient from "react-native-linear-gradient";
import { inject, observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// local component
import {
  ProductShare,
  RelatedProducts,
  ProductDetails,
  MerchantDetails,
  Photos,
  ColourVariants,
  DealSection,
  AddToCartButton
} from "./components";

@inject(stores => ({
  isOnSale:
    stores.productStore.product
    && stores.productStore.product.previousPrice > 0,
  coverImage:
    stores.productStore.product && stores.productStore.product.imageUrl,
  backgroundPosition: stores.uiStore.backgroundPosition,
  product: stores.productStore.product,
  valueOff: stores.productStore.product && stores.productStore.product.valueOff,
  discount: stores.productStore.product && stores.productStore.product.discount,

  // today's deal
  isDeal: !!stores.dealStore,
  selectedVariant: stores.productStore.selectedVariant,

  openAddSummary: async () => stores.productStore.toggleAddedSummary(true)
}))
@observer
export class Content extends React.Component {
  static propTypes = {
    backgroundPosition: PropTypes.number,
    product: PropTypes.object.isRequired,
    onScroll: PropTypes.func.isRequired,
    onPressImage: PropTypes.func.isRequired,
    isBrowsingDisabled: PropTypes.bool,
    selectedVariant: PropTypes.object
  };

  static defaultProps = {
    backgroundPosition: 0,
    isBrowsingDisabled: false
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
      <View style={{ flex: 1 }}>
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
                  {this.props.isDeal ? (
                    <DealSection navigation={this.props.navigation} />
                  ) : null}
                </LinearGradient>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
          <View style={[styles.card, styles.firstCard]}>
            <ProductDetails />
          </View>
          <Photos onPress={this.props.onPressImage} />
          <ColourVariants />
          <View style={styles.card}>
            <MerchantDetails
              isBrowsingDisabled={this.props.isBrowsingDisabled}/>
          </View>
          {!this.props.isBrowsingDisabled ? <RelatedProducts /> : null}
        </ScrollView>
        <View style={styles.footerContainer}>
          <AddToCartButton />
        </View>
      </View>
    );
  }
}

export default withNavigation(Content);

const styles = StyleSheet.create({
  productContainer: {
    paddingBottom: NAVBAR_HEIGHT + Sizes.OuterFrame
  },

  // content area
  card: {
    ...Styles.Card,
    paddingTop: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame / 8
  },

  firstCard: {
    marginVertical: null,
    marginBottom: Sizes.InnerFrame / 8
  },

  footerContainer: {
    backgroundColor: Colours.Foreground,
    width: Sizes.Width
  }
});
