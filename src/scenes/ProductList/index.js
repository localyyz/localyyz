import React from "react";
import { StyleSheet, View, SectionList } from "react-native";

// custom
import {
  ProductList,
  Filter,
  FilterBar,
  ContentCoverSlider,
  ReactiveSpacer
} from "localyyz/components";
import { Colours, Sizes, NAVBAR_HEIGHT } from "localyyz/constants";

// third party
import { Provider, inject } from "mobx-react/native";

// local
import Store from "./store";

@inject(stores => ({
  userStore: stores.userStore
}))
export default class ProductListScene extends React.Component {
  constructor(props) {
    super(props);

    // stores
    this.store = this.settings.store || new Store(this.settings);
    this.contentCoverStore = ContentCoverSlider.createStore();
    this.filterStore = Filter.getNewStore(this.store, this.props.userStore);

    // bindings
    this.onScroll = this.onScroll.bind(this);
    this.fetchMore = this.fetchMore.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderList = this.renderList.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.settings.fetchPath != prevProps.fetchPath) {
      this.store.reset && this.store.reset({}, this.settings.fetchPath);
    }
  }

  get settings() {
    return (
      (this.props.navigation
        && this.props.navigation.state
        && this.props.navigation.state.params)
      || this.props
    );
  }

  get sliderRef() {
    return this.refs.slider;
  }

  get header() {
    return (
      <View onLayout={this.contentCoverStore.onLayout}>
        {!this.settings.hideHeader ? (
          <ContentCoverSlider.Header {...this.settings || {}} />
        ) : null}
      </View>
    );
  }

  get spacer() {
    return (
      <ReactiveSpacer
        store={this.contentCoverStore}
        heightProp="headerHeight"
        offset={ContentCoverSlider.STATUS_BAR_HEIGHT}/>
    );
  }

  get listHeader() {
    return (
      <View style={styles.header}>
        {this.settings.listHeader}
        <FilterBar />
      </View>
    );
  }

  get sections() {
    return [
      { title: "spacer", data: [[{}]], renderItem: () => this.spacer },
      {
        title: "content",
        data: [[{}]]
      }
    ];
  }

  onScroll(evt) {
    this.sliderRef && this.sliderRef.onScroll(evt);
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
          <ContentCoverSlider
            ref="slider"
            title={this.settings.title}
            idleStatusBarStatus={this.settings.idleStatusBarStatus}
            iconType={this.settings.iconType}
            backColor={
              this.settings.backColor
              || (this.settings.image ? Colours.AlternateText : Colours.Text)
            }
            backAction={this.settings.onBack || this.props.navigation.goBack}
            background={this.header}
            fadeHeight={
              (this.settings.image && this.settings.image.height / 4)
              || undefined
            }>
            <SectionList
              keyboardShouldPersistTaps="always"
              sections={this.sections}
              keyExtractor={(e, i) =>
                `list-${this._keySeed}-row-${i}-id-${e.id}`
              }
              onEndReached={this.fetchMore}
              onEndReachedThreshold={1}
              onScroll={this.onScroll}
              scrollEventThrottle={16}
              renderSectionHeader={this.renderSectionHeader}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderList}
              contentContainerStyle={styles.sectionList}/>
          </ContentCoverSlider>
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
    marginTop: ContentCoverSlider.STATUS_BAR_HEIGHT,
    paddingBottom: NAVBAR_HEIGHT * 3
  },

  list: {
    padding: Sizes.InnerFrame / 2
  }
});
