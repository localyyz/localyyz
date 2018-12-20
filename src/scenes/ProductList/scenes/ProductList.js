import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { reaction } from "mobx";

// custom
import { ProductList } from "localyyz/components";
import { Colours, Sizes } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { Provider } from "mobx-react/native";
import { HeaderBackButton } from "react-navigation";

// local
import CollectionHeader from "../collectionHeader";
import { FilterStore } from "../Filter";
import CategoryHeader, {
  BAR_HEIGHT as CategoryBarHeight
} from "../categoryHeader";
import FilterBar, {
  BAR_HEIGHT as FilterBarHeight
} from "../Filter/components/Bar";
import Store from "../store";

const FULL_BAR_HEIGHT = CategoryBarHeight + FilterBarHeight;

export default class ProductListScene extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    let opt = {
      ...navigationOptions,
      title: navigation.getParam("title", ""),
      header: undefined,
      headerLeft: (
        <HeaderBackButton
          tintColor={navigationOptions.headerTintColor}
          onPress={() => navigation.goBack(null)}/>
      )
    };
    const header = navigation.getParam("header");
    if (header !== undefined) {
      opt.header = header;
    }
    return opt;
  };

  static propTypes = {
    category: PropTypes.object,
    hideCategoryBar: PropTypes.bool,
    usePreferredGender: PropTypes.bool
  };

  static defaultProps = {
    category: {},
    hideCategoryBar: false,
    usePreferredGender: true
  };

  constructor(props) {
    super(props);

    // stores
    this.store = this.settings.store || new Store(this.settings);
    this.filterStore = new FilterStore(this.store, this.settings);

    const scrollAnim = new Animated.Value(0);
    const offsetAnim = new Animated.Value(0);
    this._clampedScrollValue = 0;
    this._offsetValue = 0;
    this._scrollValue = 0;

    const barHeight = this.settings.hideCategoryBar
      ? FilterBarHeight
      : FULL_BAR_HEIGHT;

    this.state = {
      scrollAnim,
      offsetAnim,
      barHeight,
      // handle scrolling and clamp filterbar
      clampedScroll: Animated.diffClamp(
        Animated.add(
          scrollAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: "clamp"
          }),
          offsetAnim
        ),
        0,
        barHeight
      )
    };
  }

  componentDidMount() {
    // filter reaction catches filter changes and refetches the
    // parent store
    this.filterReaction = reaction(
      () => this.filterStore.fetchParams,
      params => this.filterStore.refresh(null, params),
      { fireImmediately: true, delay: 500 }
    );

    // calculate clamp values based on scroll
    this.state.scrollAnim.addListener(({ value }) => {
      // This is the same calculations that diffClamp does.
      const diff = value - this._scrollValue;
      this._scrollValue = value;
      this._clampedScrollValue = Math.min(
        Math.max(this._clampedScrollValue + diff, 0),
        this.state.barHeight
      );
    });
    this.state.offsetAnim.addListener(({ value }) => {
      this._offsetValue = value;
    });
  }

  componentWillUnmount() {
    this.state.scrollAnim.removeAllListeners();
    this.state.offsetAnim.removeAllListeners();
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
        {this.settings.collection && (
          <CollectionHeader {...this.settings.collection} />
        )}
      </View>
    );
  }

  fetchMore = ({ distanceFromEnd }) => {
    if (distanceFromEnd > 0) {
      this.store.fetchNextPage();
    }
  };

  // when user stops scrolling and filterbar is hidden/shown half way
  // clamp it to either show or hide
  // from: https://medium.com/appandflow/react-native-collapsible-navbar-e51a049b560a
  _onScrollEndDrag = () => {
    this._scrollEndTimer = setTimeout(this._onMomentumScrollEnd, 250);
  };

  _onMomentumScrollBegin = () => {
    clearTimeout(this._scrollEndTimer);
  };

  _onMomentumScrollEnd = () => {
    const toValue
      = this._scrollValue > this.state.barHeight
      && this._clampedScrollValue > this.state.barHeight / 2
        ? this._offsetValue + this.state.barHeight
        : this._offsetValue - this.state.barHeight;

    Animated.timing(this.state.offsetAnim, {
      toValue,
      duration: 350
    }).start();
  };

  render() {
    const { clampedScroll } = this.state;

    const filterbarTranslate = clampedScroll.interpolate({
      inputRange: [0, this.state.barHeight],
      outputRange: [0, -this.state.barHeight],
      extrapolate: "clamp"
    });
    const filterbarHeightAnimate = this.state.scrollAnim.interpolate({
      inputRange: [0, CategoryBarHeight],
      outputRange: [this.state.barHeight, FilterBarHeight],
      extrapolate: "clamp"
    });
    const categoryBarHeightAnimate = this.state.scrollAnim.interpolate({
      inputRange: [0, CategoryBarHeight],
      outputRange: [CategoryBarHeight, 0],
      extrapolate: "clamp"
    });
    const categoryBarOpacityAnimate = this.state.scrollAnim.interpolate({
      inputRange: [0, CategoryBarHeight],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });

    return (
      <Provider productListStore={this.store} filterStore={this.filterStore}>
        <View>
          <ProductList
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { y: this.state.scrollAnim } } }
            ])}
            onMomentumScrollBegin={this._onMomentumScrollBegin}
            onMomentumScrollEnd={this._onMomentumScrollEnd}
            onScrollEndDrag={this._onScrollEndDrag}
            containerStyle={{ paddingTop: this.state.barHeight }}
            ListHeaderComponent={this.listHeader}
            onEndReached={this.fetchMore}/>
          <Animated.View
            style={[
              styles.filterBar,
              {
                transform: [{ translateY: filterbarTranslate }],
                height: filterbarHeightAnimate
              }
            ]}>
            {!this.settings.hideCategoryBar ? (
              <Animated.View
                style={{
                  height: categoryBarHeightAnimate,
                  opacity: categoryBarOpacityAnimate
                }}>
                <CategoryHeader category={this.settings.category} />
              </Animated.View>
            ) : null}
            <FilterBar />
          </Animated.View>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  filterBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,

    borderBottomColor: Colours.Border,
    borderBottomWidth: 1,
    backgroundColor: Colours.Foreground
  },

  header: {
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  }
});
