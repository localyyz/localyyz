import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

// custom
import {
  ProductList,
  Filter,
  FilterPopupButton,
  BrowsePopupButton,
  ContentCoverSlider,
  ReactiveSpacer
} from "localyyz/components";
import { Styles, Sizes, Colours, NAVBAR_HEIGHT } from "localyyz/constants";

// third party
import { Provider, observer, inject } from "mobx-react/native";
import LinearGradient from "react-native-linear-gradient";

// local
import Store from "./store";

@inject(stores => ({
  contentCoverStore: stores.contentCoverStore,
  products:
    stores.productListStore && stores.productListStore.listData
      ? stores.productListStore.listData.slice()
      : []
}))
@observer
class Content extends React.Component {
  static propTypes = {
    products: PropTypes.array
  };

  static defaultProps = {
    products: []
  };

  get spacer() {
    return (
      <ReactiveSpacer
        store={this.props.contentCoverStore}
        heightProp="headerHeight"/>
    );
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.products.length !== this.props.products.length
      // order has changed, based on id's concat'ed (for order string)
      || (nextProps.products
        && this.props.products
        && nextProps.products.length > 0
        && this.props.products.length > 0
        && nextProps.products.map(product => product.id).join(",")
          !== this.props.products.map(product => product.id).join(","))
    );
  }

  render() {
    return (
      <ProductList
        {...this.props}
        header={this.spacer}
        products={this.props.products}
        backgroundColor={Colours.Foreground}/>
    );
  }
}

export default class ProductListScene extends React.Component {
  constructor(props) {
    super(props);

    // stores
    this.settings = props.navigation.state.params || {};
    this.store = new Store(this.settings);
    this.contentCoverStore = ContentCoverSlider.createStore();
    this.filterStore = Filter.getNewStore(this.store);
    this.state = {
      // when navigating to productList, is the filter popup visible?
      isFilterVisible: this.settings.isFilterVisible
    };

    // bindings
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.store.fetchNextPage();
  }

  get sliderRef() {
    return this.refs.slider;
  }

  get header() {
    return (
      <View onLayout={this.contentCoverStore.onLayout}>
        <ContentCoverSlider.Header {...this.settings || {}} />
      </View>
    );
  }

  onScroll(evt) {
    this.sliderRef && this.sliderRef.onScroll(evt);
  }

  render() {
    return (
      <Provider
        productListStore={this.store}
        contentCoverStore={this.contentCoverStore}>
        <View style={styles.container}>
          <ContentCoverSlider
            ref="slider"
            title={this.settings.title}
            backAction={this.props.navigation.goBack}
            background={this.header}>
            <Content
              fetchPath={this.store.fetchPath}
              onScroll={this.onScroll}
              onEndReached={() => this.store.fetchNextPage()}
              paddingBottom={NAVBAR_HEIGHT}/>
          </ContentCoverSlider>
          <View style={styles.filter} pointerEvents="box-none">
            <LinearGradient
              colors={[Colours.WhiteTransparent, Colours.Transparent]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.gradient}
              pointerEvents="box-none">
              <View style={styles.buttons}>
                <BrowsePopupButton
                  text={"Categories"}
                  store={this.filterStore}
                  isInitialVisible={this.state.isFilterVisible}/>
                <FilterPopupButton
                  store={this.filterStore}
                  isInitialVisible={false}/>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: NAVBAR_HEIGHT
  },

  filter: {
    ...Styles.Overlay,
    bottom: NAVBAR_HEIGHT,
    justifyContent: "flex-end"
  },

  gradient: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: Sizes.Height / 7,
    width: Sizes.Width
  },

  buttons: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    justifyContent: "center"
  }
});
