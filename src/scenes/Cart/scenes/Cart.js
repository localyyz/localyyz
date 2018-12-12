import React from "react";
import { View, FlatList, StyleSheet } from "react-native";

// third party
import LinearGradient from "react-native-linear-gradient";
import { observer, inject } from "mobx-react/native";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";

// local
import CartItems from "../components/CartItems";
import Totals from "../components/Totals";
import Button from "../components/Button";
import EmptyCart from "./EmptyCart";

@inject(stores => ({
  isEmpty: stores.cartStore.isEmpty,
  fetchFromDb: stores.cartStore.fetchFromDb,
  navigateNext: stores.cartUiStore.navigateNext
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

    // bindings
    this.fetch = this.fetch.bind(this);
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

  get cartItems() {
    return <CartItems />;
  }

  onNext() {
    //this.props.navigation.navigate("CheckoutStack", {});
    this.props.navigateNext(this.props.navigation);
  }

  renderItem({ item }) {
    return item.renderItem;
  }

  render() {
    return this.props.isEmpty ? (
      <EmptyCart />
    ) : (
      <View testID="cart" style={styles.container}>
        <FlatList
          data={[{ renderItem: this.cartItems }]}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.content}
          renderItem={this.renderItem}
          style={{ flex: 1 }}
          keyExtractor={(e, i) => `row-${i}`}/>
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

  content: {
    marginTop: Sizes.ScreenTop
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
