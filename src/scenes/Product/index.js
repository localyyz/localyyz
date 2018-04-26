import React from "react";
import { View, StyleSheet } from "react-native";

// custom
import Store from "./store";
import { Colours } from "localyyz/constants";
import { Product } from "localyyz/models";
import { ContentCoverSlider, PhotoDetails } from "localyyz/components";

// third party
import PropTypes from "prop-types";
import { inject, observer, Provider } from "mobx-react/native";

// local component
import { AddedSummary, ProductHeader } from "./components";
import Content from "./content";

@inject(stores => ({
  setAppContext: context => stores.navStore.setAppContext(context),
  logToHistory: product => stores.historyStore.log(product),
  hideNavbar: () => stores.navbarStore.hide(),
  write: message => stores.assistantStore(message, 10000, true),
  getWrite: message => stores.assistantStore.get(message)
}))
@observer
class ProductScene extends React.Component {
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
    this.state = {
      backgroundPosition: 0
    };

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

  get productHeader() {
    return (
      <ProductHeader
        onLayout={evt =>
          this.setState({
            backgroundPosition:
              evt.nativeEvent.layout.y + evt.nativeEvent.layout.height
          })
        }/>
    );
  }

  get productId() {
    return this.store.product
      ? this.store.product.id
      : this.props.navigation.state.params.productId;
  }

  render() {
    return this.store.product ? (
      <Provider productStore={this.store}>
        <View style={styles.productView}>
          <ContentCoverSlider
            ref={this.containerRef}
            title={this.store.product.truncatedTitle}
            backActionThrottle
            backAction={() => {
              this.props.navigation.goBack();
              this.props.navigation.state.params.onBack
                && this.props.navigation.state.params.onBack();
            }}
            fadeHeight={this.state.backgroundPosition / 3}
            background={this.productHeader}
            backColor={Colours.Text}>
            <Content
              backgroundPosition={this.state.backgroundPosition}
              navigation={this.props.navigation}
              product={this.store.product}
              onSelectVariant={this.store.onSelectVariant}
              onPressImage={imageUrl => {
                this.photoDetailsRef
                  && this.photoDetailsRef.current
                  && this.photoDetailsRef.current.wrappedInstance
                  && this.photoDetailsRef.current.wrappedInstance.toggle
                  && this.photoDetailsRef.current.wrappedInstance.toggle(
                    true,
                    imageUrl
                  );
              }}
              onScroll={evt => {
                this.containerRef.current.onScroll(evt);
              }}/>
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
