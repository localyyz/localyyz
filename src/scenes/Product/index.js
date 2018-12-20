import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";

// custom
import Store from "./store";
import { Colours, Sizes, Styles } from "localyyz/constants";

// third party
import { observer, Provider } from "mobx-react/native";

// local component
import { AddedSummary, ProductSupport, ProductShare } from "./components";
import {
  RelatedProducts,
  ProductDetails,
  ColourVariants,
  MerchantDetails,
  AddToCartButton,
  ProductBadges,
  ProductHeader,
  PhotoDetails
} from "./components";

// local
import ExpandableSection from "./components/ExpandableSection";
import ExpandedDescription from "./components/ExpandedDescription";

@observer
class ProductScene extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { state: { params } } = navigation;
    const { product } = params;

    return {
      ...navigationOptions,
      // NOTE: this is terrible. when add summary is open
      // there's some weird issue with header buttons always clicked
      // on top of everything else. we need to hide it or the x button
      // wont work
      header: params.hideHeader ? null : undefined,
      headerRight: (
        <View
          style={{
            flexDirection: "row",
            marginRight: Sizes.InnerFrame
          }}>
          <ProductShare product={product} />
          <ProductSupport />
        </View>
      )
    };
  };

  constructor(props) {
    super(props);
    this.settings = this.props.navigation.state.params;

    // data
    this.store = new Store(this.settings);
    this.photoDetailsRef = React.createRef();
  }

  onPressImage = imageUrl => {
    return (
      this.photoDetailsRef
      && this.photoDetailsRef.current
      && this.photoDetailsRef.current.toggle
      && this.photoDetailsRef.current.toggle(true, imageUrl)
    );
  };

  onScroll = ({ nativeEvent }) => {
    const hidingHeader = this.props.navigation.getParam("hideHeader");
    if (nativeEvent.contentOffset.y > Sizes.Height / 3 && !hidingHeader) {
      this.props.navigation.setParams({ hideHeader: true });
    } else if (
      nativeEvent.contentOffset.y <= Sizes.Height / 3
      && hidingHeader
    ) {
      this.props.navigation.setParams({ hideHeader: false });
    }
  };

  render() {
    return (
      <Provider productStore={this.store}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <ScrollView
              onScroll={this.onScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}>
              <ProductHeader
                onPress={this.onPressImage}
                selectedVariant={this.store.selectedVariant}
                images={this.store.product.images.slice()}/>

              <ProductDetails />
              <ProductBadges />

              <View style={styles.card}>
                <ExpandableSection
                  content={this.props.description}
                  title="Product Information"
                  onExpand={() => {
                    this.props.navigation.navigate("Modal", {
                      type: "product detail",
                      title: this.store.product.title,
                      description: this.store.product.htmlDescription,
                      component: <ExpandedDescription />
                    });
                  }}/>
                <MerchantDetails />
              </View>

              <ColourVariants />
              <RelatedProducts />
            </ScrollView>
            <View style={styles.footerContainer}>
              <AddToCartButton />
            </View>
          </View>
          <PhotoDetails
            navigation={this.props.navigation}
            ref={this.photoDetailsRef}/>
          {this.store.isAddedSummaryVisible ? <AddedSummary /> : null}
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Background
  },

  // content area
  card: {
    ...Styles.Card,
    paddingTop: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame / 8
  },

  footerContainer: {
    backgroundColor: Colours.Foreground,
    width: Sizes.Width
  }
});

export default ProductScene;
