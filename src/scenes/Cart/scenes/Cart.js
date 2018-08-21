import React from "react";
import { View, FlatList, StyleSheet } from "react-native";

// third party
import LinearGradient from "react-native-linear-gradient";
import { observer, inject } from "mobx-react/native";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";
import { ContentCoverSlider, ReactiveSpacer } from "localyyz/components";

// local
import CartItems from "../components/CartItems";
import Totals from "../components/Totals";
import Button from "../components/Button";
import EmptyCart from "./EmptyCart";

@inject(stores => ({
  isEmpty: stores.cartStore.isEmpty,
  fetchFromDb: stores.cartStore.fetchFromDb
}))
@observer
export default class Cart extends React.Component {
  static propTypes = {
    isEmpty: PropTypes.bool,
    fetchFromDb: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired
  };

  static defaultProps = {
    isEmpty: true
  };

  constructor(props) {
    super(props);

    // data
    this.ccs = ContentCoverSlider.createStore();

    // bindings
    this.fetch = this.fetch.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onNext = this.onNext.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "didFocus",
      this.fetch
    );
  }

  async fetch() {
    let resolved = await this.props.fetchFromDb();

    // recursively try again until it works
    if (resolved.error) {
      resolved = await this.fetch();
    }

    return resolved;
  }

  componentWillUnmount() {
    // unsubscribe to listeners
    this.focusListener && this.focusListener.remove();
    this.focusListener = null;
  }

  get spacer() {
    return <ReactiveSpacer store={this.ccs} heightProp="headerHeight" />;
  }

  get sliderRef() {
    return this.refs.slider;
  }

  get header() {
    return (
      <View onLayout={this.ccs.onLayout}>
        <ContentCoverSlider.Header title={this.title} />
      </View>
    );
  }

  get cartItems() {
    return (
      <CartItems navigation={this.props.navigation} onScroll={this.onScroll} />
    );
  }

  get data() {
    return [
      {
        renderItem: this.spacer
      },
      {
        renderItem: this.cartItems
      }
    ];
  }

  get title() {
    return "Your cart";
  }

  onScroll(evt) {
    return this.sliderRef && this.sliderRef.onScroll(evt);
  }

  onNext() {
    this.props.navigation.navigate("CheckoutStack");
  }

  renderItem({ item }) {
    return item.renderItem;
  }

  render() {
    return this.props.isEmpty ? (
      <EmptyCart />
    ) : (
      <View testID="cart" style={styles.container}>
        <ContentCoverSlider
          ref="slider"
          title={this.title}
          backAction={false}
          background={this.header}>
          <FlatList
            data={this.data}
            onScroll={this.onScroll}
            renderItem={this.renderItem}
            keyExtractor={(e, i) => `row-${i}`}/>
        </ContentCoverSlider>
        <View style={styles.footer} pointerEvents="box-none">
          <LinearGradient
            colors={[
              Colours.Foreground,
              Colours.Foreground,
              Colours.Transparent
            ]}
            start={{ y: 1, x: 0 }}
            end={{ y: 0, x: 0 }}
            style={styles.gradient}
            pointerEvents="box-none">
            <View style={styles.summary}>
              <Totals />
              <View style={styles.spacer} />
              <Button onPress={this.onNext}>Proceed to checkout</Button>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: NAVBAR_HEIGHT,
    paddingBottom: Sizes.OuterFrame * 3
  },

  footer: {
    ...Styles.Overlay,
    top: undefined
  },

  summary: {
    padding: Sizes.InnerFrame
  },

  spacer: {
    height: Sizes.InnerFrame
  },

  gradient: {
    paddingTop: Sizes.OuterFrame * 2
  }
});
