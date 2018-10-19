import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  SectionList,
  AppState
} from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Sizes, Styles, Colours } from "localyyz/constants";

// local
import DealCard, { CardWidth, CardHeight } from "./DealCard";
import DealType from "./DealType";
import FeaturedDealsCarousel from "./FeaturedDealsCarousel";

@inject(stores => ({
  store: stores.dealStore,
  fetch: stores.dealStore.fetchDeals,
  fetchFeatured: stores.dealStore.fetchFeaturedDeals,
  refresh: stores.dealStore.refreshDeals,
  dealTab: stores.dealStore.dealTab && stores.dealStore.dealTab.id,
  deals: stores.dealStore.deals ? stores.dealStore.deals.slice() : [],
  isLoading: stores.dealStore.isLoading,
  isRefreshing: stores.dealStore.isRefreshing
}))
@observer
export class DealList extends React.Component {
  constructor(props) {
    super(props);
    this.sectionListRef = React.createRef();
    this.appState = AppState.currentState;
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (prevProps.dealTab && this.props.dealTab !== prevProps.dealTab) {
      this.sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex: 0,
        itemIndex: 0,
        viewOffset: 100 // height of section header
      });
    }
  }

  componentDidMount() {
    // ON focus, refresh deals
    this.focusListener = this.props.navigation.addListener(
      "didFocus",
      this.refreshDeals
    );
    AppState.addEventListener("change", this._appStateListener);
  }

  componentWillUnmount() {
    // unsubscribe to listeners
    this.focusListener && this.focusListener.remove();
    this.focusListener = null;
    AppState.removeEventListener("change", this._appStateListener);
  }

  _appStateListener = nextState => {
    if (this.appState.match(/inactive|background/) && nextState === "active") {
      this.refreshDeals();
    }
    this.appState = nextState;
  };

  renderItem = ({ item: deal }) => {
    return (
      <View
        style={{
          paddingTop: Sizes.InnerFrame,
          paddingHorizontal: Sizes.InnerFrame / 2
        }}>
        <DealCard {...deal} cardStyle={{ width: CardWidth }} />
      </View>
    );
  };

  fetchMore = ({ distanceFromEnd }) => {
    if (distanceFromEnd > 0) {
      this.props.fetch();
    }
  };

  renderDealType = () => {
    return (
      <View style={styles.sectionHeader}>
        <DealType />
      </View>
    );
  };

  renderEmptyItem = ({ section }) => {
    if (
      section.data.length == 0
      && !this.props.isLoading
      && !this.props.isRefreshing
    ) {
      return (
        <View>
          <View height={20} />
          <Text style={styles.emptyListStyle}>
            Check back later for more deals!
          </Text>
        </View>
      );
    }

    return this.props.isLoading && !this.props.isRefreshing ? (
      <View>
        <View height={20} />
        <ActivityIndicator
          style={styles.loading}
          animating={true}
          size="large"/>
      </View>
    ) : null;
  };

  refreshDeals = () => {
    this.props.refresh();
    this.props.fetchFeatured();
  };

  render() {
    return (
      <SectionList
        ref={this.sectionListRef}
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
        sections={[{ data: this.props.deals }]}
        renderItem={this.renderItem}
        ListHeaderComponent={<FeaturedDealsCarousel />}
        renderSectionHeader={this.renderDealType}
        scrollEventThrottle={16}
        initialNumToRender={1}
        contentContainerStyle={styles.list}
        style={styles.container}
        onEndReached={this.fetchMore}
        onEndReachedThreshold={1}
        refreshing={this.props.isRefreshing}
        onRefresh={this.refreshDeals}
        renderSectionFooter={this.renderEmptyItem}/>
    );
  }
}

export default withNavigation(DealList);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  loading: {
    flex: 1,
    backgroundColor: Colours.Foreground
  },

  list: {
    justifyContent: "center",
    paddingBottom: Sizes.ScreenBottom + CardHeight,
    backgroundColor: Colours.Foreground
  },

  sectionHeader: {
    backgroundColor: Colours.Foreground
  },

  emptyListStyle: {
    textAlign: "center",
    ...Styles.Subdued,
    fontSize: 15,
    paddingHorizontal: 0,
    backgroundColor: Colours.Foreground
  }
});
