import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

// third party
import { Provider } from "mobx-react/native";
import LinearGradient from "react-native-linear-gradient";

// custom
import { Styles, Colours, Sizes, NAVBAR_HEIGHT } from "localyyz/constants";

// local
import {
  Price,
  Discounts,
  Brands,
  Sizes as SizesFilter,
  Colors,
  Categories,
  ProductCount,
  Merchants
} from "../Filter";

export default class FilterMenu extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    header: undefined,
    title: "Filter"
  });

  constructor(props) {
    super(props);

    // bindings
    this.close = this.close.bind(this);
  }

  get settings() {
    return (
      (this.props.navigation
        && this.props.navigation.state
        && this.props.navigation.state.params)
      || this.props
    );
  }

  componentDidMount() {
    this.settings.store && this.settings.store.refresh();
  }

  close() {
    return this.settings.onBack
      ? this.settings.onBack()
      : this.props.navigation.goBack(null);
  }

  // Filter Main scene embeds the Filter component
  // which is a collection of individual filterable parts
  //  all tapped into a single filter store
  render() {
    return (
      <Provider filterStore={this.settings.store}>
        <View style={styles.container}>
          <View style={styles.filter}>
            <Categories />
            <SizesFilter />
            <Price />
            <Colors />
            <Brands />
            <Merchants />
            <Discounts />
          </View>
          <View pointerEvents="box-none" style={styles.footer}>
            <LinearGradient
              pointerEvents="box-none"
              colors={[Colours.WhiteTransparent, Colours.Transparent]}
              start={{ y: 1, x: 0 }}
              end={{ y: 0, x: 0 }}
              style={styles.gradient}>
              <View style={styles.toggle}>
                <TouchableOpacity onPress={this.close}>
                  <View style={styles.button}>
                    <ProductCount labelStyle={styles.label} />
                  </View>
                </TouchableOpacity>
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
    marginBottom: NAVBAR_HEIGHT,
    backgroundColor: Colours.Foreground
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },

  gradient: {},

  toggle: {
    alignItems: "center"
  },

  button: {
    ...Styles.RoundedButton,
    alignItems: "center",
    margin: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame * 2,
    backgroundColor: Colours.Action
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  filter: {
    paddingHorizontal: Sizes.InnerFrame
  }
});
