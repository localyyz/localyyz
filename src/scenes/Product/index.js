import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";

// custom
import Store from "./store";
import { Colours, Sizes, NAVBAR_HEIGHT } from "localyyz/constants";
import { ContentCoverSlider, PhotoDetails } from "localyyz/components";
import { box } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import { inject, observer, Provider } from "mobx-react/native";

// local component
import { AddedSummary, ProductHeader, ProductShare } from "./components";
import Content from "./content";

// constants
// should be manually sync'ed whenever the CTA header changes in layout
const CTA_HEIGHT = 100;
const DEAL_HEIGHT = 0;

@inject(stores => ({
  logToHistory: product => stores.historyStore.log(product),
  write: message => stores.assistantStore(message, 10000, true),
  getWrite: message => stores.assistantStore.get(message)
}))
@observer
class ProductScene extends React.Component {
  @box backgroundPosition = 0;

  static propTypes = {
    navigation: PropTypes.object.isRequired,

    // mobx injected
    logToHistory: PropTypes.func.isRequired
  };

  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { state: { params } } = navigation;
    const { product } = params;

    return {
      ...navigationOptions,
      headerTitle: product && product.brand,
      header: null
    };
  };

  constructor(props) {
    super(props);
    this.settings = this.props.navigation.state.params;

    // data
    this.store = new Store(props.navigation.state.params);

    // refs
    this.containerRef = React.createRef();
    this.photoDetailsRef = React.createRef();

    // bindings
    this.onVariantChange = this.onVariantChange.bind(this);
    this.onPressImage = this.onPressImage.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount() {
    // internal history logging
    this.store.product && this.props.logToHistory(this.store.product);
  }

  onVariantChange(variant) {
    this.store.onSelectVariant(variant);
  }

  get shouldCrop() {
    return this.store.product
      ? this.store.product.category
          && (this.store.product.category.type === "shoes"
            || this.store.product.category.type === "sneakers")
      : false;
  }

  get productHeader() {
    return (
      <ProductHeader
        onLayout={evt => {
          let position
            = evt.nativeEvent.layout.y + evt.nativeEvent.layout.height;
          let maxPosition
            = Sizes.Height
            - CTA_HEIGHT
            - (this.settings.dealStore ? DEAL_HEIGHT : 0)
            - NAVBAR_HEIGHT;

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
    return this.store.product ? this.store.product.id : this.settings.productId;
  }

  onPressImage(imageUrl) {
    return (
      this.photoDetailsRef
      && this.photoDetailsRef.current
      && this.photoDetailsRef.current.toggle
      && this.photoDetailsRef.current.toggle(true, imageUrl)
    );
  }

  onScroll(evt) {
    return this.containerRef && this.containerRef.current.onScroll(evt);
  }

  onBack() {
    this.props.navigation.goBack(null);
    this.settings.onBack && this.settings.onBack();
  }

  render() {
    return this.store.product ? (
      <Provider
        productStore={this.store}
        uiStore={this}
        dealStore={this.settings.dealStore}
        activeDealStore={this.settings.activeDealStore}>
        <View style={styles.productView}>
          <StatusBar hidden />
          <ContentCoverSlider
            ref={this.containerRef}
            title={this.store.product.truncatedTitle}
            backAction={this.onBack}
            fadeHeight={this.backgroundPosition / 3}
            background={this.productHeader}>
            <Content
              isBrowsingDisabled={this.props.navigation.getParam(
                "isBrowsingDisabled",
                false
              )}
              settings={this.settings}
              onPressImage={this.onPressImage}
              onScroll={this.onScroll}/>
          </ContentCoverSlider>
          <ProductShare />
          <PhotoDetails
            navigation={this.props.navigation}
            ref={this.photoDetailsRef}/>
          {this.store.isAddedSummaryVisible ? <AddedSummary /> : null}
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
