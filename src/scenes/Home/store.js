// custom
import { Product } from "localyyz/models";
import { ApiInstance } from "localyyz/global";
import { box } from "localyyz/helpers";
import { Sizes } from "localyyz/constants";

// third party
import { observable, action, runInAction, reaction, when } from "mobx";
import { lazyObservable } from "mobx-utils";
import { Animated } from "react-native";

const PAGE_LIMIT = 25;

export default class HomeStore {
  constructor(loginStore) {
    this.api = ApiInstance;
    this.login = loginStore;

    // _initialized is needed to monitor loginStore initialization
    // mobx will not react when this.login becomes truthy
    runInAction("[ACTION] done initialized", () => {
      this._isInitialized = true;
    });
  }

  _listProducts = listData => {
    return (listData || []).map(
      p =>
        new Product({
          ...p,
          description: p.noTagDescription,
          titleWordsLength: 3,
          descriptionWordsLength: 10
        })
    );
  };

  /////////////////////////////////// search observables

  @box searchQuery = "";
  @box searchResults;

  reactSearch = reaction(
    () => this.searchQuery,
    searchQuery => {
      if (searchQuery.length > 0) {
        this.searchResults = lazyObservable(sink =>
          this.api
            .post("search", { query: this.searchQuery }, { limit: PAGE_LIMIT })
            .then(response => sink(this._listProducts(response.data)))
        );
      }
    },
    { delay: 1000 }
  );

  /////////////////////////////////// data observables

  @observable _isInitialized = false;
  @observable featuredProducts;
  @observable discountedProducts;

  // when the app logs the user in (or skips login) fetch home products
  reactLogin = when(
    () =>
      this._isInitialized
      && (this.login._wasLoginSuccessful || this.login._wasLoginSkipped),
    () => {
      this.fetchFeaturedProducts();
      this.fetchDiscountedProducts();
    }
  );

  fetchFeaturedProducts = async () => {
    this.featuredProducts = lazyObservable(sink =>
      this.api
        .get("products/featured", { limit: 6 })
        .then(response => sink(this._listProducts(response.data)))
    );
  };

  @action
  fetchDiscountedProducts = async () => {
    this.discountedProducts = lazyObservable(sink =>
      this.api
        .get("products/onsale", { limit: 25 })
        .then(response => sink(this._listProducts(response.data)))
    );
  };

  /////////////////////////////////// shared UI states below

  // UI states shared between components
  @box headerHeight = 0;
  // determines if the search results UI is visible
  @box scrollAnimate = new Animated.Value(0);
  _previousScrollAnimate = 0;

  @box searchActive = false;
  @box searchFocused = false;

  reactHeaderScroll = reaction(
    () => this.searchActive,
    searchActive => {
      if (searchActive) {
        // save the previous scroll location
        this._previousScrollAnimate = this.scrollAnimate._value;

        // update the animate value
        Animated.timing(this.scrollAnimate, {
          toValue: Sizes.Height * 2
        }).start();
      } else {
        // update the animate value to previously saved height
        Animated.timing(this.scrollAnimate, {
          toValue: this._previousScrollAnimate
        }).start();
        this._previousScrollAnimate = 0;
      }
    }
  );

  //////////////////////////////////////////////////////////
}
