import { action, observable, computed } from "mobx";

import { GA, ApiInstance } from "~/src/global";
import { userStore } from "~/src/stores";

export default class FilterStore {
  // sorting
  @observable sortBy;

  // price filter
  @observable priceMin;
  @observable priceMax;

  // discount filter
  @observable discountMin;

  // gender filter
  @observable gender;

  // other filters
  @observable brand;
  @observable size;
  @observable color;
  @observable categoryValue;
  @observable merchant;
  @observable categoryV2;

  // customize personalize filters
  @observable personalize;

  // TODO: make section list:
  //  sales %
  //  new sales
  //  deals -> free shipping

  constructor(searchStore, props) {
    // requires .reset(params) and .numProducts
    this.searchStore = searchStore;

    // set gender from settings on mount, can be overrided
    // NOTE: defaultGender for example can be passed in from search browse
    // as a navigation param. TODO: let's fix this.
    //
    // usePreferredGender by default is true. but if we're accessing
    // product list from categories, we don't want to filter
    if (props.usePreferredGender) {
      let gender = props.gender || userStore.genderPreference;
      gender && this.setGenderFilter([gender]);
    }

    // initial settings
    if (props.filtersort) {
      props.filtersort.category
        && this.setCategoryV2Filter([props.filtersort.category]);
      props.filtersort.merchant
        && this.setMerchantFilter([props.filtersort.merchant]);
      props.filtersort.brand && this.setBrandFilter([props.filtersort.brand]);
      props.filtersort.discountMin
        && this.setDiscountFilter(props.filtersort.discountMin);
      props.filtersort.gender
        && this.setGenderFilter([props.filtersort.gender]);
      this.setPersonalize(props.filtersort);
    }
  }

  @computed
  get numFilters() {
    // get the number of different filter types that has been applied
    let count = 0;
    count += this.priceMax || this.priceMax ? 1 : 0;
    count += this.discountMin ? 1 : 0;
    count += this.brand ? 1 : 0;
    count += this.size ? 1 : 0;
    count += this.color ? 1 : 0;
    count += this.categoryValue ? 1 : 0;
    count += this.merchant ? 1 : 0;
    return count;
  }

  reset = fetchPath => {
    this.setSizeFilter();
    this.setBrandFilter();
    this.setColorFilter();
    this.setCategoryFilter();
    this.setMerchantFilter();
    this.setCategoryV2Filter();
    this.setPriceFilter();

    // and update based on reset filters
    this.refresh(fetchPath);
  };

  refresh = (fetchPath, params) => {
    this.searchStore.reset(params || this.fetchParams, fetchPath || "");
  };

  // asyncFetch recursively fetches the available filters
  // for example:
  //
  // it would render a request that looks like:
  //
  // /products/categories?filters=brand,val=gucci
  //
  asyncFetch = (filterBy = "", params = {}) => {
    const fetchPath = this.searchStore.fetchPath || "products";
    let fetchParams = { ...params, ...this.fetchParams };
    fetchParams.filter = fetchParams.filter.filter(
      f => !f.startsWith(filterBy)
    );
    return this.searchStore.fetch
      ? this.searchStore.fetch(filterBy, fetchParams)
      : ApiInstance.get(`${fetchPath}/${filterBy}`, fetchParams);
  };

  fetchPrices = () => this.asyncFetch("prices");
  fetchColors = () => this.asyncFetch("colors");
  fetchSizes = () => this.asyncFetch("sizes");
  fetchBrands = () => this.asyncFetch("brands");
  fetchMerchants = () => this.asyncFetch("stores");
  fetchCategories = () => this.asyncFetch("subcategories");

  @action
  setSizeFilter = val => {
    this.size = val;
  };

  @action
  setColorFilter = val => {
    this.color = val;
  };

  @action
  setGenderFilter = val => {
    this.gender = val;
  };

  @action
  setBrandFilter = val => {
    this.brand = val;
  };

  @action
  setMerchantFilter = val => {
    this.merchant = val;
  };

  @action
  setCategoryFilter = category => {
    category
      && category.length > 0
      && GA.trackEvent(
        "filter",
        "by category",
        category.join(",") || "all categories"
      );
    this.categoryValue = category;
  };

  @action
  setCategoryV2Filter = category => {
    GA.trackEvent("filter/sort", "filter by category v2", `${category}`);
    this.categoryV2 = parseInt(category, 10);
  };

  @action
  setPriceFilter = (min = 0, max) => {
    this.priceMin = min;
    this.priceMax = max;
  };

  @action
  setDiscountFilter = (min = 0) => {
    GA.trackEvent("filter/sort", "discount", `${min}`);
    this.discountMin = min;
  };

  @action
  setSortBy = sorter => {
    GA.trackEvent("filter/sort", "sort", sorter);
    this.sortBy = sorter;
  };

  @action
  setPersonalize({ style, pricing, gender }) {
    let p = {};
    if (style) {
      p.style = [style];
    }
    if (pricing) {
      p.pricing = [pricing];
    }
    if (gender) {
      p.gender = [gender];
    }
    this.personalize = p == {} ? undefined : p;
  }

  @computed
  get price() {
    return this.priceMin ? [`$${this.priceMin} - $${this.priceMax}`] : [];
  }

  @computed
  get discount() {
    return this.discountMin ? [`On sale ${this.discountMin}% Off`] : [];
  }

  @computed
  get numProducts() {
    return Math.max(
      0,
      this.searchStore.numProducts || 0,
      this.searchStore.products.length
    );
  }

  @computed
  get isLoading() {
    return (this.searchStore && this.searchStore.isLoading) || false;
  }

  @computed
  get fetchParams() {
    return {
      ...(this.sortBy && {
        sort: this.sortBy
      }),
      filter: [
        ...(this.priceMin !== undefined ? [`prices,min=${this.priceMin}`] : []),
        ...(this.priceMax !== undefined ? [`prices,max=${this.priceMax}`] : []),
        ...(this.discountMin !== undefined
          ? [`discounts,min=${this.discountMin}`]
          : []),
        ...(this.gender ? [`genders,val=${this.gender.join("|")}`] : []),
        ...(this.brand ? [`brands,val=${this.brand.join("|")}`] : []),
        ...(this.color ? [`colors,val=${this.color.join("|")}`] : []),
        ...(this.size ? [`sizes,val=${this.size.join("|")}`] : []),
        ...(this.merchant ? [`merchants,val=${this.merchant.join("|")}`] : []),
        ...(this.categoryValue
          ? [`categoryValues,val=${this.categoryValue.join("|")}`]
          : []),
        ...(this.categoryV2
          ? [`categories,val=${JSON.stringify([this.categoryV2])}`]
          : []),
        ...(this.personalize
          ? [`personalize,val=${JSON.stringify(this.personalize)}`]
          : [])
      ]
    };
  }
}
