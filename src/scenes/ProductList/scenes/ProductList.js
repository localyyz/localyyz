import React from "react";
import { StyleSheet, View } from "react-native";
import { reaction } from "mobx";

// custom
import { ProductList } from "localyyz/components";
import { Colours, Sizes } from "localyyz/constants";

// third party
import { Provider } from "mobx-react/native";
import { HeaderBackButton } from "react-navigation";

// local
import { FilterStore, FilterBar } from "../Filter";
import Store from "../store";

export default class ProductListScene extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    let opt = {
      ...navigationOptions,
      title: navigation.getParam("title", ""),
      headerLeft: (
        <HeaderBackButton
          tintColor={navigationOptions.headerTintColor}
          onPress={() => navigation.goBack(null)}/>
      )
    };
    const header = navigation.getParam("header");
    if (header) {
      opt.header = header;
    }
    return opt;
  };

  constructor(props) {
    super(props);

    // stores
    this.store = this.settings.store || new Store(this.settings);
    this.filterStore = new FilterStore(this.store, this.settings.gender);
  }

  componentDidUpdate(prevProps) {
    // category change, reflect it down into store
    if (this.settings.title != this.getSettings(prevProps).title) {
      this.filterStore.reset && this.filterStore.reset(this.settings.fetchPath);
    }
  }

  componentDidMount() {
    // filter reaction catches filter changes and refetches the
    // parent store
    this.filterReaction = reaction(
      () => this.filterStore.fetchParams,
      params => this.filterStore.refresh(null, params),
      { fireImmediately: true, delay: 500 }
    );
  }

  get settings() {
    return this.getSettings(this.props);
  }

  getSettings = props => {
    return (
      (props.navigation
        && props.navigation.state
        && props.navigation.state.params)
      || props
    );
  };

  get listHeader() {
    return (
      <View style={styles.header}>
        {this.settings.listHeader ? this.settings.listHeader : <View />}
        <FilterBar />
      </View>
    );
  }

  fetchMore = ({ distanceFromEnd }) => {
    if (distanceFromEnd > 0) {
      this.store.fetchNextPage();
    }
  };

  render() {
    return (
      <Provider productListStore={this.store} filterStore={this.filterStore}>
        <ProductList
          ListHeaderComponent={this.listHeader}
          onEndReached={this.fetchMore}/>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  }
});
