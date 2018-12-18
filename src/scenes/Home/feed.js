import React from "react";
import { AppState, RefreshControl, View, Text, StyleSheet } from "react-native";

import { inject, observer } from "mobx-react/native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider
} from "recyclerlistview";
import Moment from "moment";

import { ProductTileHeight } from "~/src/components/ProductTileV2";
import { Styles, Colours, Sizes } from "~/src/constants";

import CollectionBanner, {
  CollectionHeight
} from "./components/collectionBanner";
import FeedRow from "./components/feedRow";
import PulseOverlay from "./components/pulseOverlay";
import OnboardPrompt from "./components/onboardPrompt";

const SeparatorH = Sizes.OuterFrame * 3 + Sizes.InnerFrame;
const ProductTileH = ProductTileHeight + Sizes.InnerFrame * 4;
const RowH = Sizes.OuterFrame * 2 + Sizes.Width / 8 + ProductTileH + SeparatorH;
const CollectionH = CollectionHeight + SeparatorH;
const CardH = Sizes.Height / 4 + 2 * Sizes.InnerFrame;

@inject(stores => ({
  feed: stores.homeStore.feed.slice(),
  fetch: stores.homeStore.fetchFeed,
  onScrollAnimate: stores.homeStore.onScrollAnimate,
  navbarStore: stores.navbarStore
}))
@observer
export default class Feed extends React.Component {
  constructor(props) {
    super(props);

    this._dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    this.appState = AppState.currentState;
    this.state = {
      isProcessing: true,
      layoutProvider: new LayoutProvider()
    };
  }

  fetchFeed = () => {
    this.props.navbarStore.hide(); // hide navbar
    !this._unmounted && this.setState({ lastFetchedAt: Moment() });
    this.props.fetch().then(() => {
      this.props.navbarStore.show();
      let layoutProvider = new LayoutProvider(
        index => {
          switch (this.props.feed[index].type) {
            case "collection":
              return 1;
            case "preference-full":
              return 3;
            case "preference":
              return 4;
            default:
              return 2;
          }
        },
        (type, dim) => {
          dim.width = Sizes.Width;

          switch (type) {
            case 1: // collections
              dim.height = CollectionH;
              break;
            case 2: // generic
              dim.height = RowH;
              break;
            case 3: // full height preference:
              dim.height = 2 * Sizes.Height / 3;
              break;
            case 4: // preference cards
              dim.height = CardH + 2 * Sizes.InnerFrame;
              break;
            default:
              // generic
              dim.height = RowH;
          }
        }
      );
      !this._unmounted
        && this.setState({
          isProcessing: false,
          layoutProvider: layoutProvider
        });
    });
  };

  componentDidMount() {
    this.fetchFeed();
    AppState.addEventListener("change", this._appStateListener);
  }

  componentWillUnmount() {
    this._unmounted = true;
    // unsubscribe to listeners
    this.focusListener && this.focusListener.remove();
    this.focusListener = null;
    AppState.removeEventListener("change", this._appStateListener);
  }

  _appStateListener = nextState => {
    if (this.appState.match(/inactive|background/) && nextState === "active") {
      const shouldFetch
        = Moment.duration(this.state.lastFetchedAt.diff(Moment())).asMinutes()
        > 5;
      if (shouldFetch) {
        this.fetchFeed();
      }
    }
    this.appState = nextState;
  };

  renderItem = (type, data) => {
    switch (data.type) {
      case "collection":
        return <CollectionBanner {...data} />;
      case "preference":
      case "preference-full":
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: Colours.Foreground,
              justifyContent: "space-around",
              alignItems: "center",
              paddingHorizontal: Sizes.InnerFrame
            }}>
            {data.type == "preference-full" && (
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Text
                  style={{
                    ...Styles.Text,
                    ...Styles.Emphasized,
                    textAlign: "center",
                    padding: 8
                  }}>
                  Hey stranger!
                </Text>
                <Text style={Styles.Subtext}>
                  Got time to answer a quick questions?
                </Text>
              </View>
            )}
            <OnboardPrompt {...data} onComplete={this.fetchFeed} />;
          </View>
        );
      default:
        return <FeedRow {...data} />;
    }
  };

  render() {
    if (this.state.isProcessing) {
      return <PulseOverlay isProcessing={this.state.isProcessing} />;
    }
    return (
      <RecyclerListView
        scrollViewProps={{
          directionalLockEnabled: true,
          scrollEventThrottle: 16,
          contentContainerStyle: {
            paddingBottom: RowH / 3
          }
        }}
        style={styles.container}
        dataProvider={this._dataProvider.cloneWithRows(this.props.feed)}
        layoutProvider={this.state.layoutProvider}
        rowRenderer={this.renderItem}
        onScroll={this.props.onScrollAnimate}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isProcessing || false}
            onRefresh={this.fetchFeed}/>
        }/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
