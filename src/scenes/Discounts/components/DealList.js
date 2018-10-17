import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Text,
  View,
  SectionList
} from "react-native";

// third party
import { observer, inject, Provider } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Sizes, Styles, NAVBAR_HEIGHT, Colours } from "localyyz/constants";
import { GA } from "localyyz/global";

// local
import DealCard, { CardHeight } from "./DealCard";
import DealType from "./DealType";
import FeaturedDealsCarousel from "./FeaturedDealsCarousel";

const CardWidth = Sizes.Width - Sizes.InnerFrame;

@inject(stores => ({
  store: stores.dealStore,
  fetch: stores.dealStore.fetchDeals,
  refresh: stores.dealStore.refreshDeals,
  dealTab: stores.dealStore.dealTab && stores.dealStore.dealTab.id,
  deals: stores.dealStore.deals ? stores.dealStore.deals.slice() : [],
  dealType: stores.dealStore.dealType && stores.dealStore.dealType.id,
  isLoading: stores.dealStore.isLoading,
  isRefreshing: stores.dealStore.isRefreshing
}))
@observer
export class DealList extends React.Component {
  renderItem = ({ item: deal }) => {
    this.dealTab = this.props.dealTab;
    return (
      <View style={{ paddingHorizontal: Sizes.InnerFrame / 2 }}>
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

  render() {
    return (
      <SectionList
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
        onRefresh={this.props.refresh}
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
