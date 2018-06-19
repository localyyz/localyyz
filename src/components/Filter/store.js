import { action, observable, computed, reaction } from "mobx";
import { capitalize } from "localyyz/helpers";

export default class FilterStore {
  // sorting
  @observable sortBy;

  // price filter
  @observable priceMin;
  @observable priceMax;

  // discount filter
  @observable discountMin;

  // gender filter
  @observable gender = "woman";

  // ui
  @observable scrollEnabled;

  constructor(searchStore, initParams = {}) {
    // requires .reset(params) and .categories and .numProducts
    this.searchStore = searchStore;

    // bindings
    this.setPriceFilter = this.setPriceFilter.bind(this);
    this.setDiscountFilter = this.setDiscountFilter.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
    this.setScrollEnabled = this.setScrollEnabled.bind(this);

    // initial
    this.scrollEnabled = true;
    this.loadInit(initParams);
  }

  @action
  loadInit(params = {}) {
    // if initial params are available, set them
    for (let key in params) {
      if (params[key] !== undefined) {
        this[key] = params[key];
      }
    }
  }

  @computed
  get categoryFilter() {
    // TODO: clean this up...
    if (this.searchStore.categories) {
      if (this.searchStore.categories.current) {
        // it's an lazyObservable
        let categories
          = this.searchStore.categories.current()
          && this.searchStore.categories.current().data;

        return categories
          ? categories.values.map(value => ({
              title: capitalize(value),
              fetchPath: `/categories/${categories.type}/${value}`
            }))
          : [];
      } else {
        return this.searchStore.categories.slice().map(category => ({
          title: capitalize(category.type),
          fetchPath: `${category.fetchPath}/${category.type}`
        }));
      }
    }
    return [];
  }

  @computed
  get numProducts() {
    return (this.searchStore && this.searchStore.numProducts) || 0;
  }

  @action
  setGenderFilter = val => {
    this.gender = val;
  };

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
  get params() {
    return {
      sortBy: this.sortBy,
      priceMin: this.priceMin,
      priceMax: this.priceMax,
      discountMin: this.discountMin,
      gender: this.gender
    };
  }

  @computed
  get fetchParams() {
    return {
      ...(this.sortBy && {
        sort: this.sortBy
      }),
      ...(this.priceMin || this.priceMax || this.discountMin || this.gender
        ? {
            filter: [
              ...(this.priceMin !== undefined
                ? [`price,min=${this.priceMin}`]
                : []),
              ...(this.priceMax !== undefined
                ? [`price,max=${this.priceMax}`]
                : []),
              ...(this.discountMin !== undefined
                ? [`discount,min=${this.discountMin}`]
                : []),
              ...(this.gender !== undefined
                ? [`gender,val=${this.gender}`]
                : [])
            ]
          }
        : null)
    };
  }
}
