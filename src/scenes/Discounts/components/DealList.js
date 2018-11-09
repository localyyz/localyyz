import React from "react";

import { StyleSheet, Text, View, SectionList, AppState } from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Sizes, Styles, Colours } from "~/src/constants";
import {
  Placeholder as ProductTilePlaceholder,
  BadgeType
} from "~/src/components/ProductTileV2";

// local
import DealCard, { CardHeight } from "./DealCard";
import FeaturedDeals from "./FeaturedDeals";

@inject(stores => ({
  store: stores.dealStore,
  fetch: stores.dealStore.fetchDeals,
  fetchFeatured: stores.dealStore.fetchFeaturedDeals,
  refresh: stores.dealStore.refreshDeals,
  dealTab: stores.dealStore.dealTab && stores.dealStore.dealTab.id,
  isLoading: stores.dealStore.isLoading,
  isRefreshing: stores.dealStore.isRefreshing,
  deals: stores.dealStore.deals.slice(),
  featuredDeals: stores.dealStore.featuredDeals.slice()
}))
@observer
export class DealList extends React.Component {
  constructor(props) {
    super(props);
    this.appState = AppState.currentState;
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

  renderDeals = ({ item: deal }) => {
    return (
      <View
        style={{
          backgroundColor: Colours.Foreground,
          borderBottomWidth: Sizes.Hairline,
          borderBottomColor: Colours.Border,
          paddingTop: Sizes.InnerFrame / 2,
          paddingHorizontal: Sizes.InnerFrame / 2
        }}>
        <DealCard {...deal} />
      </View>
    );
  };

  fetchMore = ({ distanceFromEnd }) => {
    if (distanceFromEnd > 0) {
      this.props.fetch();
    }
  };

  renderSectionFooter = ({ section }) => {
    return section.type !== "featured"
      && this.props.featuredDeals.length === 0
      && section.data.length === 0
      && !(this.props.isLoading && this.props.isRefreshing) ? (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 20
        }}>
        <ProductTilePlaceholder scale={0.9} badgeType={BadgeType.Deal} />
        <Text style={styles.emptyListStyle}>
          No deals yet. come back later for more!
        </Text>
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
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.content}
        extraData={{
          isRefreshing: this.props.isRefreshing
        }}
        sections={[
          {
            data: this.props.featuredDeals,
            title: "Featured Deals",
            type: "featured",
            renderItem: ({ index }) =>
              index === 0 && this.props.featuredDeals.length > 0 ? (
                <FeaturedDeals />
              ) : null
          },
          { data: this.props.deals }
        ]}
        scrollEventThrottle={16}
        initialNumToRender={1}
        onEndReached={this.fetchMore}
        onEndReachedThreshold={1}
        refreshing={this.props.isRefreshing}
        onRefresh={this.refreshDeals}
        renderItem={this.renderDeals}
        renderSectionFooter={this.renderSectionFooter}/>
    );
  }
}

export default withNavigation(DealList);

const styles = StyleSheet.create({
  container: {
    paddingTop: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  content: {
    paddingBottom: Sizes.ScreenBottom + CardHeight,
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
