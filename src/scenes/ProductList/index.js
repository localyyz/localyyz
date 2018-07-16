import React from "react";
import { StyleSheet, View } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

// custom
import {
  BaseScene,
  ProductList,
  Filter,
  FilterPopupButton,
  BrowsePopupButton
} from "localyyz/components";
import { Styles, Sizes, Colours, NAVBAR_HEIGHT } from "localyyz/constants";

// third party
import { Provider, observer, inject } from "mobx-react/native";
import LinearGradient from "react-native-linear-gradient";

// local
import Store from "./store";

@inject(stores => ({
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
        products={this.props.products}
        backgroundColor={Colours.Foreground}
        style={styles.content}/>
    );
  }
}

@withNavigation
export default class ProductListScene extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.settings = props.navigation.state.params || {};
    this.store = new Store(this.settings);
    this.filterStore = Filter.getNewStore(this.store);
    this.state = {
      // when navigating to productList, is the filter popup visible?
      isFilterVisible: this.settings.isFilterVisible
    };
  }

  componentDidMount() {
    this.store.fetchNextPage();
  }

  render() {
    return (
      <Provider productListStore={this.store}>
        <View style={styles.container}>
          <BaseScene
            title={this.settings.title}
            description={this.settings.description}
            image={this.settings.image}
            backAction={this.props.navigation.goBack}>
            <Content
              fetchPath={this.store.fetchPath}
              onEndReached={() => this.store.fetchNextPage()}/>
          </BaseScene>
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
    flex: 1
  },

  content: {
    paddingBottom: NAVBAR_HEIGHT
  },

  filter: {
    ...Styles.Overlay,
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
    justifyContent: "center",
  },
});
