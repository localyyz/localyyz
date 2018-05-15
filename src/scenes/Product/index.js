import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

// custom
import Store from "./store";
import { Colours, Sizes, NAVBAR_HEIGHT } from "localyyz/constants";
import { Product } from "localyyz/models";
import { ContentCoverSlider, PhotoDetails } from "localyyz/components";
import { box } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { inject, observer, Provider } from "mobx-react/native";

// local component
import { AddedSummary, ProductHeader } from "./components";
import Content from "./content";

// constants
const CTA_HEIGHT = 175.5;

@inject(stores => ({
  setAppContext: context => stores.navStore.setAppContext(context),
  logToHistory: product => stores.historyStore.log(product),
  hideNavbar: () => stores.navbarStore.hide(),
  write: message => stores.assistantStore(message, 10000, true),
  getWrite: message => stores.assistantStore.get(message)
}))
@observer
class ProductScene extends React.Component {
  @box backgroundPosition = 0;

  static propTypes = {
    navigation: PropTypes.object.isRequired,

    // mobx injected
    setAppContext: PropTypes.func.isRequired,
    logToHistory: PropTypes.func.isRequired,
    hideNavbar: PropTypes.func.isRequired
  };

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { state: { params } } = navigation;
    const { product } = params;

    return {
      ...navigationOptions,
      headerTitle: product && product.brand
    };
  };

  constructor(props) {
    super(props);
    this.store = new Store(props.navigation.state.params);

    // product creation if not provided
    if (
      props.navigation.state.params.product
      && !(props.navigation.state.params.product instanceof Product)
    ) {
      props.navigation.state.params.product = new Product(
        props.navigation.state.params.product
      );
    }

    // refs
    this.containerRef = React.createRef();
    this.photoDetailsRef = React.createRef();

    // bindings
    this.fetchDeepLinkedProduct = this.fetchDeepLinkedProduct.bind(this);
    this.onVariantChange = this.onVariantChange.bind(this);
    this.onPressImage = this.onPressImage.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    // deep link initialization
    !this.store.product && this.fetchDeepLinkedProduct();

    // set app context
    this.props.setAppContext("product");

    // internal history logging
    this.store.product && this.props.logToHistory(this.store.product);
  }

  componentWillUnmount() {
    // set app context to help app resume the correct state
    // please see "Deeplink" for comments and why this is needed
    this.props.setAppContext();
  }

  fetchDeepLinkedProduct(next) {
    const { navigation: { state } } = next || this.props;

    this.store.isDeepLinked = true;
    state.params
      && this.store
        .fetchProduct(state.params.productId, true)
        .then(
          () => !this.store.relatedProducts && this.store.fetchRelatedProduct()
        );
  }

  onVariantChange(variant) {
    this.store.onSelectVariant(variant);
  }

  get shouldCrop() {
    return this.store.product
      ? this.store.product.category
          && this.store.product.category.type === "shoes"
      : false;
  }

  get productHeader() {
    return (
      <ProductHeader
        onLayout={evt => {
          let position
            = evt.nativeEvent.layout.y + evt.nativeEvent.layout.height;
          let maxPosition = Sizes.Height - CTA_HEIGHT - NAVBAR_HEIGHT;

          // shoes look funny when overlayed, so prevent it
          let overlayedPosition = position - (this.shouldCrop ? 0 : CTA_HEIGHT);

          // either we use position if short, or overlayed if it exceeds maxPosition
          this.backgroundPosition = Math.min(
            position > maxPosition ? overlayedPosition : position,

            // capped
            maxPosition
          );
        }}/>
    );
  }

  get productId() {
    return this.store.product
      ? this.store.product.id
      : this.props.navigation.state.params.productId;
  }

  onPressImage(imageUrl) {
    return (
      this.photoDetailsRef
      && this.photoDetailsRef.current
      && this.photoDetailsRef.current.wrappedInstance
      && this.photoDetailsRef.current.wrappedInstance.toggle
      && this.photoDetailsRef.current.wrappedInstance.toggle(true, imageUrl)
    );
  }

  onScroll(evt) {
    return this.containerRef && this.containerRef.current.onScroll(evt);
  }

  onBack() {
    this.props.navigation.goBack();
    this.props.navigation.state.params.onBack
      && this.props.navigation.state.params.onBack();
  }

  render() {
    return this.store.product ? (
      <Provider productStore={this.store} uiStore={this}>
        <View style={styles.productView}>
          <StatusBar hidden />
          <ContentCoverSlider
            ref={this.containerRef}
            title={this.store.product.truncatedTitle}
            backActionThrottle
            backAction={this.onBack}
            fadeHeight={this.backgroundPosition / 3}
            background={this.productHeader}
            backColor={Colours.Text}>
            <Content
              onPressImage={this.onPressImage}
              onScroll={this.onScroll}/>
          </ContentCoverSlider>
          <AddedSummary />
          <PhotoDetails
            navigation={this.props.navigation}
            ref={this.photoDetailsRef}/>
        </View>
      </Provider>
    ) : null;
  }
}

const styles = StyleSheet.create({
  productView: {
    flex: 1,
    backgroundColor: Colours.Background
  }
});

export default ProductScene;
