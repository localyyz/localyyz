import React from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity
} from "react-native";

// third party
import { Provider } from "mobx-react/native";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";

// local
import {
  Prices,
  Discounts,
  Brands,
  Sizes as SizesFilter,
  Colors,
  Categories,
  ProductCount,
  Merchants,
  Genders
} from "../Filter/components";

export default class FilterMenu extends React.Component {
  static navigationOptions = ({ navigationOptions }) => {
    return {
      ...navigationOptions,
      title: "Filter"
    };
  };

  constructor(props) {
    super(props);
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

  close = () => {
    return this.settings.onBack
      ? this.settings.onBack()
      : this.props.navigation.goBack(null);
  };

  // Filter Main scene embeds the Filter component
  // which is a collection of individual filterable parts
  //  all tapped into a single filter store
  render() {
    return (
      <Provider filterStore={this.settings.store}>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Genders />
            <Categories />
            <SizesFilter />
            <Prices />
            <Colors />
            <Brands />
            <Merchants />
            <Discounts />
          </ScrollView>
          <View pointerEvents="box-none" style={styles.footer}>
            <View style={styles.toggle}>
              <TouchableOpacity onPress={this.close}>
                <View style={styles.button}>
                  <ProductCount labelStyle={styles.label} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },

  content: {
    paddingHorizontal: Sizes.InnerFrame,
    paddingBottom: Sizes.Height / 6
  },

  toggle: {
    alignItems: "center",
    marginBottom: Sizes.InnerFrame
  },

  button: {
    ...Styles.RoundedButton,
    alignItems: "center",
    margin: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame * 2
  },

  label: {
    ...Styles.RoundedButtonText
  }
});
