import React from "react";
import { StyleSheet, View, SectionList } from "react-native";
import { reaction } from "mobx";

// custom
import { ProductList } from "localyyz/components";
import { Colours, Sizes, NAVBAR_HEIGHT } from "localyyz/constants";

// third party
import { Provider, inject } from "mobx-react/native";
import { HeaderBackButton } from "react-navigation";

// local
import { FilterStore, FilterBar } from "../Filter";
import Store from "../store";

@inject(stores => ({
  userStore: stores.userStore
}))
export default class ProductListScene extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => ({
    ...navigationOptions,
    title: navigation.getParam("title", ""),
    headerLeft: (
      <HeaderBackButton
        tintColor={navigationOptions.headerTintColor}
        onPress={() => navigation.goBack(null)}/>
    )
  });

  constructor(props) {
    super(props);

    // stores
    this.store = this.settings.store || new Store(this.settings);
    this.filterStore = new FilterStore(
      this.store,
      this.props.userStore,
      this.settings.gender
    );

    // bindings
    this.fetchMore = this.fetchMore.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderList = this.renderList.bind(this);
    this.getSettings = this.getSettings.bind(this);
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

  getSettings(props) {
    return (
      (props.navigation
        && props.navigation.state
        && props.navigation.state.params)
      || props
    );
  }

  get sliderRef() {
    return this.refs.slider;
  }

  get listHeader() {
    return (
      <View style={styles.header}>
        {this.settings.listHeader ? this.settings.listHeader : <View />}
        <FilterBar />
      </View>
    );
  }

  fetchMore({ distanceFromEnd }) {
    if (distanceFromEnd > 0) {
      this.store.fetchNextPage();
    }
  }

  renderSectionHeader({ section: { title } }) {
    return (title === "content" && this.listHeader) || <View />;
  }

  renderList() {
    return (
      <ProductList backgroundColor={Colours.Accented} style={styles.list} />
    );
  }

  render() {
    return (
      <Provider productListStore={this.store} filterStore={this.filterStore}>
        <View style={styles.container}>
          <SectionList
            keyboardShouldPersistTaps="always"
            sections={[
              {
                title: "content",
                data: [[{}]]
              }
            ]}
            keyExtractor={(e, i) => `productList${i}${e.id}`}
            onEndReached={this.fetchMore}
            onEndReachedThreshold={1}
            scrollEventThrottle={16}
            renderSectionHeader={this.renderSectionHeader}
            stickySectionHeadersEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderList}
            contentContainerStyle={styles.sectionList}/>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  sectionList: {
    paddingBottom: NAVBAR_HEIGHT * 3
  },

  list: {
    padding: Sizes.InnerFrame / 2
  }
});
