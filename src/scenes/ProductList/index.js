import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

// custom
import {
  ContentCoverSlider,
  ProductList,
  NavBar,
  Filter,
  FilterPopupButton
} from "localyyz/components";
import { Styles, Sizes, Colours, NAVBAR_HEIGHT } from "localyyz/constants";

// third party
import { Provider, observer, inject } from "mobx-react/native";

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
    headerHeight: PropTypes.number,
    products: PropTypes.array
  };

  static defaultProps = {
    headerHeight: 0,
    products: []
  };

  shouldComponentUpdate(nextProps) {
    // wrapper component that stops ProductList
    // rerendering if header height has not been updated
    return (
      nextProps.headerHeight !== this.props.headerHeight
      || nextProps.products.length !== this.props.products.length
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
    this.store = new Store(props.navigation.state.params);
    this.filterStore = Filter.getNewStore(this.store);
    this.state = {
      headerHeight: 0,

      // when navigating to productList, is the filter popup visible?
      isFilterVisible:
        props.navigation.state.params
        && props.navigation.state.params.isFilterVisible
    };
  }

  componentDidMount() {
    this.store.fetchNextPage();
  }

  render() {
    return (
      <Provider productListStore={this.store}>
        <View style={styles.container}>
          <ContentCoverSlider
            ref="container"
            title={this.props.navigation.state.params.title}
            backAction={() => this.props.navigation.goBack()}
            backColor={Colours.Text}
            background={
              <View
                onLayout={e =>
                  this.setState({
                    headerHeight: Math.round(e.nativeEvent.layout.height)
                  })
                }>
                <View style={styles.header}>
                  {this.props.navigation.state.params.title ? (
                    <Text style={styles.headerLabel}>
                      {this.props.navigation.state.params.title}
                    </Text>
                  ) : null}
                  {this.props.navigation.state.params.subtitle ? (
                    <Text style={styles.headerSublabel}>
                      {this.props.navigation.state.params.subtitle}
                    </Text>
                  ) : null}
                </View>
              </View>
            }>
            <Content
              onScroll={e => this.refs.container.onScroll(e)}
              headerHeight={this.state.headerHeight}
              paddingBottom={this.state.headerHeight + NavBar.HEIGHT}
              fetchPath={this.store.fetchPath}
              onEndReached={() => this.store.fetchNextPage()}/>
          </ContentCoverSlider>

          <View style={styles.filter} pointerEvents="box-none">
            <FilterPopupButton
              store={this.filterStore}
              isInitialVisible={this.state.isFilterVisible}/>
          </View>
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

  header: {
    ...Styles.Card,
    marginBottom: Sizes.InnerFrame,
    marginTop: Sizes.OuterFrame * 5,
    paddingHorizontal: null,
    backgroundColor: Colours.Transparent
  },

  headerLabel: {
    ...Styles.Text,
    ...Styles.SectionTitle
  },

  headerSublabel: {
    ...Styles.Text,
    ...Styles.SectionSubtitle
  },

  content: {
    paddingVertical: Sizes.InnerFrame,
    paddingBottom: NavBar.HEIGHT * 5
  },

  filter: {
    ...Styles.Overlay,
    bottom: NAVBAR_HEIGHT + Sizes.InnerFrame - 2
  }
});
