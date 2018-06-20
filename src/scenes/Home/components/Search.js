import React from "react";
import { View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Styles, Sizes, NAVBAR_HEIGHT } from "localyyz/constants";

// third party
import { BlurView, FilterPopup } from "localyyz/components";
import * as Animatable from "react-native-animatable";
import { Provider, inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";

// local
import SearchResult from "./SearchResult";

@inject(stores => ({
  searchStore: stores.homeStore,
  searchActive: stores.homeStore.searchActive,
  headerHeight: stores.homeStore.headerHeight,
  numProducts: stores.homeStore.numProducts,
  onPress: () => {
    if (stores.homeStore.searchResults.length === 0) {
      stores.homeStore.searchActive = false;
      stores.homeStore.searchQuery = "";
    }
  }
}))
@observer
export default class Search extends React.Component {
  static propTypes = {
    searchActive: PropTypes.bool,
    headerHeight: PropTypes.number,
    onPress: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { blurviewRef: null };
    this.filterStore = FilterPopup.getNewStore(this.props.searchStore);
  }

  render() {
    const { searchActive, headerHeight, onPress } = this.props;

    return searchActive ? (
      <Provider filterStore={this.filterStore}>
        <Animatable.View
          animation="fadeIn"
          duration={300}
          style={[styles.searchOverlay, { paddingTop: headerHeight }]}>
          <TouchableWithoutFeedback onPress={onPress}>
            <BlurView
              blurType="light"
              blurAmount={10}
              style={styles.searchOverlayBlur}>
              <SearchResult />
            </BlurView>
          </TouchableWithoutFeedback>
          <View style={styles.filter} pointerEvents="box-none">
            <FilterPopup
              contentStyle={{ paddingTop: this.props.headerHeight }}/>
          </View>
        </Animatable.View>
      </Provider>
    ) : null;
  }
}

const styles = StyleSheet.create({
  searchOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  searchOverlayBlur: {
    flex: 1
  },

  filter: {
    ...Styles.Overlay,
    bottom: NAVBAR_HEIGHT + Sizes.InnerFrame - 2
  }
});
