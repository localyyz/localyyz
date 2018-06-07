import { action, observable, computed, reaction } from "mobx";

export default class FilterStore {
  // sorting
  @observable sortBy;

  // price filter
  @observable priceMin;
  @observable priceMax;

  // discount filter
  @observable discountMin;

  // ui
  @observable scrollEnabled;

  constructor(searchStore) {
    // requires .reset(params)
    this.searchStore = searchStore;

    // bindings
    this.setPriceFilter = this.setPriceFilter.bind(this);
    this.setDiscountFilter = this.setDiscountFilter.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
    this.setScrollEnabled = this.setScrollEnabled.bind(this);

    // initial
    this.scrollEnabled = true;
  }

  @action
  setPriceFilter(min, max) {
    this.priceMin = min;
    this.priceMax = max;
  }

  @action
  setDiscountFilter(min) {
    var multiplier = Math.pow(10, 2);
    this.discountMin = Math.round(min * multiplier) / multiplier;
  }

  @action
  setSortBy(sorter) {
    this.sortBy = sorter;
  }

  @action
  setScrollEnabled(enabled) {
    this.scrollEnabled = enabled;
  }

  get isSearchSupported() {
    return !!this.searchStore && !!this.searchStore.reset;
  }

  filterReaction = reaction(
    () => this.fetchParams,
    params => {
      if (this.isSearchSupported) {
        this.searchStore.reset(params);
      }
    }
  );

  @computed
  get fetchParams() {
    return {
      ...(this.sortBy && {
        sort: this.sortBy
      }),
      ...(this.priceMin || this.priceMax || this.discountMin
        ? {
            filter: [
              ...(this.priceMin || this.priceMax
                ? [`price,min=${this.priceMin},max=${this.priceMax}`]
                : []),
              ...(this.discountMin ? [`discount,min=${this.discountMin}`] : [])
            ]
          }
        : null)
    };
  }
}