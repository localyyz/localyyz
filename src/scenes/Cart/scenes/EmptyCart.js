import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";
import { BaseScene, ProductList } from "localyyz/components";
import { icon } from "localyyz/assets";

@inject(stores => ({
  history: Object.values(stores.historyStore.groups)
    .reduce((acc, group) => [...acc, ...group], [])
    .map(item => stores.historyStore.products[item.productId])
    .filter(product => product),
  fetchHistory: stores.historyStore.fetchHistory
}))
@observer
export default class EmptyCart extends React.Component {
  componentDidMount() {
    this.props.fetchHistory();
  }

  get header() {
    return (
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={icon} style={styles.logo} />
        </View>
      </View>
    );
  }

  render() {
    return (
      <BaseScene
        title="Your cart"
        backgroundColor={Colours.Foreground}
        style={{ minHeight: Sizes.Height / 2 }}
        header={this.header}>
        <View style={styles.content}>
          <Text style={styles.title}>Your cart is empty</Text>
          {this.props.history.length ? (
            <View>
              <Text style={styles.subtitle}>
                {"Here's some recently viewed products"}
              </Text>
              <Ionicons
                name="ios-arrow-down"
                style={styles.subtitle}
                size={Sizes.ActionButton}
                underlayColor={Colours.Transparent}
                backgroundColor={Colours.Transparent}/>
              <ProductList isLoading={false} products={this.props.history} />
              <LinearGradient
                colors={[Colours.Foreground, Colours.Transparent]}
                start={{ y: 1, x: 0 }}
                end={{ y: 0, x: 0 }}
                style={styles.overlay}
                pointerEvents="none"/>
            </View>
          ) : null}
        </View>
      </BaseScene>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Sizes.OuterFrame * 2
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Oversized,
    maxWidth: 2 * Sizes.Width / 3,
    paddingHorizontal: Sizes.InnerFrame
  },

  subtitle: {
    ...Styles.Text,
    ...Styles.Emphasized,
    fontSize: Sizes.H3,
    marginVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame
  },

  logoContainer: {
    paddingTop: Sizes.OuterFrame * 2,
    paddingBottom: Sizes.OuterFrame,
    paddingLeft: Sizes.Height / 4,
    overflow: "hidden"
  },

  logo: {
    height: Sizes.Height / 2,
    width: Sizes.Height / 2
  },

  overlay: {
    ...Styles.Overlay,
    top: undefined,
    bottom: NAVBAR_HEIGHT,
    height: Sizes.OuterFrame * 3,
    width: Sizes.Width
  }
});
