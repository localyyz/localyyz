// custom
import { Product } from "localyyz/models";
import { ApiInstance } from "localyyz/global";
import { box } from "localyyz/helpers";
import { Sizes } from "localyyz/constants";

// third party
import { observable, action, runInAction, reaction, when } from "mobx";
import { lazyObservable } from "mobx-utils";
import { Animated } from "react-native";

const PAGE_LIMIT = 8;
const PAGE_ONE = 1;

export default class HomeStore {
  constructor(loginStore, assistantStore) {
    this.api = ApiInstance;
    this.login = loginStore;
    this.assistant = assistantStore;

    // _initialized is needed to monitor loginStore initialization
    // mobx will not react when this.login becomes truthy
    runInAction("[ACTION] done initialized", () => {
      this.INTERNAL_isInitialized = true;
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
  @box searchResults = [];
  // internal values
  // next: marks the next page value
  // hasNextPage: for search, the backend link value isn't reliable,
  //  backend gives a truthy has next page because it trades accuracy for
  //  speed
  // processing: onEndReached would be incorrectly triggered as list items
  //  starts to load, need to switch to a loading state to not over load
  INTERNAL_next = 1;
  INTERNAL_hasNextPage = true;
  INTERNAL_processing = false;

  reactSearch = reaction(
    () => this.searchQuery,
    searchQuery => {
      if (searchQuery.length > 0) {
        // on new search, reset internal values and search result
        this.INTERNAL_next = 1;
        this.INTERNAL_hasNextPage = true;
        this.INTERNAL_processing = false;
        this.searchResults.clear();

        // fetch new result
        this.fetchNextPage();
      }
    },
    { delay: 1000 }
  );

  fetchNextPage = () => {
    if (this.INTERNAL_hasNextPage && !this.INTERNAL_processing) {
      this.INTERNAL_processing = true;

      this.api
        .post(
          "search",
          { query: this.searchQuery },
          { page: this.INTERNAL_next, limit: PAGE_LIMIT }
        )
        .then(response => {
          if (response && response.status < 400 && response.data.length > 0) {
            runInAction("[ACTION] post search", () => {
              this.searchResults = [
                ...this.searchResults.slice(),
                ...this._listProducts(response.data)
              ];
            });
            this.INTERNAL_next++;
          } else {
            if (this.INTERNAL_next === PAGE_ONE) {
              this.assistant.write(
                `Sorry! I couldn't find any product for "${this.searchQuery}"`,
                5000
              );
            }
          }

          // NOTE: because search returns "estimated" number of pages, can't
          // rely on the provided next pages as indicator if there is next page
          this.INTERNAL_hasNextPage
            = response.data && response.data.length === PAGE_LIMIT;
          this.INTERNAL_processing = false;
        })
        .catch(console.log);
    }
  };

  /////////////////////////////////// data observables

  // initialized marks the store being constructed, this is needed
  // to tell reactLogin to not jump the gun and load too early...
  // TODO: is there a better cleaner way?
  @observable INTERNAL_isInitialized = false;
  @observable featuredProducts;
  @observable discountedProducts;

  // when the app logs the user in (or skips login) fetch home products
  reactLogin = reaction(
    () => {
      return {
        success: this.INTERNAL_isInitialized && this.login._wasLoginSuccessful,
        skipped: this.INTERNAL_isInitialized && this.login._wasLoginSkipped
      };
    },
    ({ success, skipped }) => {
      console.log("fetching because logged in", success, skipped);
      if (success || skipped) {
        this.fetchFeaturedProducts();
        this.fetchDiscountedProducts();
      }
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
  // NOTE: updated by Header component onLayout
  @box headerHeight = 0;
  // determines if the search results UI is visible
  @box scrollAnimate = new Animated.Value(0);
  _previousScrollAnimate = 0;

  @box searchActive = false;
  @box searchFocused = false;

  // react header scroll reacts to "searchActive" value changes
  // when true:
  //     records the previous header height and
  //     animates the header height and opacity to a minimum
  // when false:
  //     scrolls to the previous header height
  reactHeaderScroll = reaction(
    () => this.searchActive,
    searchActive => {
      if (searchActive) {
        // save the previous scroll location
        this._previousScrollAnimate = this.scrollAnimate._value;

        // update the animate value
        Animated.timing(this.scrollAnimate, {
          toValue: Sizes.Height
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

  @box searchTagsVisible = true;

  //////////////////////////////////////////////////////////
}
