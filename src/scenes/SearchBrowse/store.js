// custom
import { Product } from "localyyz/models";
import { ApiInstance, GA } from "localyyz/global";
import { assistantStore } from "localyyz/stores";
import { box, capitalize } from "localyyz/helpers";
import {
  SEARCH_SUGGESTIONS_FEMALE,
  SEARCH_SUGGESTIONS_MALE
} from "localyyz/constants";

// third party
import { observable, action, runInAction, computed } from "mobx";

// constants
const PAGE_LIMIT = 8;
const PAGE_ONE = 1;

// API (interchangable with ProductListStore): products, numProducts,
// fetchNextPage(params), reset(params)
export default class Store {
  constructor() {
    this.api = ApiInstance;

    // bindings
    this.changeGenderSuggestions = this.changeGenderSuggestions.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.reset = this.reset.bind(this);
  }

  _listProducts = listData => {
    return (
      (listData || [])
        .map(
          p =>
            new Product({
              ...p,
              description: p.noTagDescription,
              titleWordsLength: 3,
              descriptionWordsLength: 10
            })
        )

        // only with photos and variant available
        .filter(p => p.associatedPhotos.length > 0 && p.selectedVariant.price)
    );
  };

  /////////////////////////////////// search suggestion observables
  @box currentSuggestion = 0;
  @observable searchSuggestions = SEARCH_SUGGESTIONS_FEMALE;

  @action
  changeGenderSuggestions(gender) {
    this.searchSuggestions
      = gender === "male" ? SEARCH_SUGGESTIONS_MALE : SEARCH_SUGGESTIONS_FEMALE;
  }
  /////////////////////////////////// search observables

  @observable searchQuery = "";
  @observable products = [];
  @box numProducts = 0;
  // internal values
  // next: marks the next page value
  // hasNextPage: for search, the backend link value isn't reliable,
  //  backend gives a truthy has next page because it trades accuracy for
  //  speed
  // processing: onEndReached would be incorrectly triggered as list items
  //  starts to load, need to switch to a loading state to not over load
  @box _processing = false;

  _nextSearch;
  _selfSearch;

  @computed
  get hasResults() {
    return this.products.length > 0;
  }

  @action
  clearSearch(query) {
    this.searchQuery = query || "";
    this.products.clear();
  }

  @action
  reset(params) {
    if (this.searchQuery.length > 0) {
      // on new search, reset internal values and search result
      this._nextSearch = null;
      this._selfSearch = null;
      this._processing = false;
      this.products.clear();

      // fetch new result
      this.fetchNextPage(params);
    }
  }

  @computed
  get isProcessingQuery() {
    return (
      !!this._processing && (this.selfSearch && this.selfSearch.page === 1)
    );
  }

  fetchNextPage = params => {
    if (this._processing || (this._selfSearch && !this._nextSearch)) {
      console.log(
        `skip page fetch already loading or reached end. l:${
          this._processing
        } n:${this._nextSearch}`
      );
      return;
    }

    this._processing = true;
    this.api
      .post(
        (this._nextSearch && this._nextSearch.url) || "search",
        { query: this.searchQuery },
        { ...params, limit: PAGE_LIMIT }
      )
      .then(response => {
        if (response && response.status < 400 && response.data.length > 0) {
          GA.trackEvent("search", "view search result", this.searchQuery);
          runInAction("[ACTION] post search", () => {
            // product count
            if (response.headers && response.headers["x-item-total"] != null) {
              this.numProducts
                = parseInt(response.headers["x-item-total"]) || 0;
            }

            this.products = [
              ...this.products.slice(),
              ...this._listProducts(response.data)
            ];
          });

          this._nextSearch = response.link.next;
          this._selfSearch = response.link.self;
        } else {
          // TODO: backend should sendback a http status hinting no results
          if (
            (!this._selfSearch || this._selfSearch.page === PAGE_ONE)
            && !params
          ) {
            GA.trackEvent("search", "no results found", this.searchQuery);
            assistantStore.write(
              `Sorry! I couldn't find any product for "${this.searchQuery}"`,
              5000
            );
          }
        }

        this._processing = false;
      })
      .catch(console.log);
  };

  /////////////////////////////////// category states below
  @observable categories = [];
  @observable gender;

  @computed
  get fetchCategoriesParams() {
    return {
      filter: [...(this.gender ? [`gender,val=${this.gender.filterId}`] : [])]
    };
  }

  @action
  setGender = gender => {
    // if same, then toggle off
    this.gender = !this.gender || gender.id != this.gender.id ? gender : null;

    // trigger refresh of categories
    this.fetchCategories();
  };

  @action
  fetchCategories = async () => {
    let response = await this.api.get(
      "categories",
      this.fetchCategoriesParams,
      true
    );
    if (response.status < 400 && response.data && response.data.length > 0) {
      runInAction("[ACTION] fetch categories", () => {
        this.categories = response.data.map(category => ({
          ...category,
          id: category.type,
          title: capitalize(category.type),
          values: [
            { id: category.type, title: `All ${capitalize(category.type)}` },

            // backwards compatible with values as strings instead
            // of cat objs
            ...(category.categories || category.values || []).map(
              v =>
                v.type
                  ? {
                      ...v,
                      id: v.type,
                      title: capitalize(v.type)
                    }
                  : {
                      id: v,
                      title: capitalize(v)
                    }
            )
          ]
        }));
      });
    }
  };
}
