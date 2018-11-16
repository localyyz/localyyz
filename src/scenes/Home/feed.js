import React from "react";
import { AppState, RefreshControl, StyleSheet } from "react-native";

import { inject, observer } from "mobx-react/native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider
} from "recyclerlistview";
import Moment from "moment";

import { ProductTileHeight } from "~/src/components/ProductTileV2";
import { Sizes } from "~/src/constants";

import CollectionBanner, {
  CollectionHeight
} from "./components/collectionBanner";
import FeedRow from "./components/feedRow";
import PulseOverlay from "./components/pulseOverlay";

const SeparatorH = Sizes.OuterFrame * 2.5 + 1;
const ProductTileH = ProductTileHeight + Sizes.InnerFrame * 4;
const RowH = Sizes.OuterFrame * 2 + ProductTileH + SeparatorH;
const CollectionH = CollectionHeight + SeparatorH;

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
      layoutProvider: new LayoutProvider()
    };
  }

  fetchFeed = () => {
    this.props.navbarStore.hide();
    !this._unmounted
      && this.setState({ lastFetchedAt: Moment(), isProcessing: true });
    this.props.fetch().then(() => {
      this.props.navbarStore.show();
      let layoutProvider = new LayoutProvider(
        index => {
          switch (this.props.feed[index].type) {
            case "collection":
              return 1;
            default:
              return 2;
          }
        },
        (type, dim) => {
          dim.width = Sizes.Width;
          dim.height = type == 1 ? CollectionH : RowH;
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
    if (data.type == "collection") {
      return <CollectionBanner {...data} />;
    }
    return <FeedRow {...data} />;
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
