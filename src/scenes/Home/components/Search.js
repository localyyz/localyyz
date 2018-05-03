import React from "react";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";

// third party
import { BlurView } from "localyyz/components";
import * as Animatable from "react-native-animatable";
import { inject, observer } from "mobx-react";
import PropTypes from "prop-types";

// local
import SearchResult from "./SearchResult";

@inject(stores => ({
  searchActive: stores.homeStore.searchActive,
  headerHeight: stores.homeStore.headerHeight,
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
  }

  render() {
    const { searchActive, headerHeight, onPress } = this.props;

    return searchActive ? (
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
      </Animatable.View>
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
  }
});
