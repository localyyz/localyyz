import { runInAction, action, observable, computed, reaction } from "mobx";
import { ApiInstance as api } from "localyyz/global";
import { capitalize } from "localyyz/helpers";

// constants
// inconsistency between user settings and filters from API
const GENDER_MAPPING = { male: "man", female: "woman" };

export default class FilterStore {
  // sorting
  @observable sortBy = "created_at";

  // price filter
  @observable priceMin;
  @observable priceMax;

  // discount filter
  @observable discountMin;

  // gender filter
  @observable _gender;

  // other filters
  @observable brand;
  @observable size;
  @observable color;

  // lists
  @observable brands = [];
  @observable colors = [];
  @observable sizes = [];

  // ui
  @observable scrollEnabled;

  constructor(searchStore, userStore, defaultGender) {
    // requires .reset(params) and .numProducts
    this.searchStore = searchStore;

    // bindings
    this.reset = this.reset.bind(this);
    this.refresh = this.refresh.bind(this);
    this.asyncFetch = this.asyncFetch.bind(this);

    this.fetchColors = this.fetchColors.bind(this);
    this.fetchSizes = this.fetchSizes.bind(this);
    this.fetchBrands = this.fetchBrands.bind(this);

    this.setSizeFilter = this.setSizeFilter.bind(this);
    this.setColorFilter = this.setColorFilter.bind(this);
    this.setGenderFilter = this.setGenderFilter.bind(this);
    this.setBrandFilter = this.setBrandFilter.bind(this);
    this.setPriceFilter = this.setPriceFilter.bind(this);
    this.setDiscountFilter = this.setDiscountFilter.bind(this);
    this.setSortBy = this.setSortBy.bind(this);
    this.setScrollEnabled = this.setScrollEnabled.bind(this);

    // set gender from settings on mount, can be
    // overrided
    let gender = defaultGender || (userStore && userStore.gender);
    gender = GENDER_MAPPING[gender];
    gender && this.setGenderFilter(gender);

    // initial
    this.scrollEnabled = true;
  }

  // filter reaction catches filter changes and refetches the
  // parent store
  filterReaction = reaction(
    () => this.fetchParams,
    params => this.refresh(null, params)
  );

  reset(fetchPath) {
    this.setSizeFilter();
    this.setBrandFilter();
    this.setColorFilter();
    this.setDiscountFilter();
    this.setPriceFilter();

    // and update based on reset filters
    this.refresh(fetchPath);
  }

  refresh(fetchPath, params) {
    if (this.isSearchSupported) {
      this.searchStore.reset(params || this.fetchParams, fetchPath || "");
    }
  }

  // asyncFetch recursively fetches the available filters
  // for example:
  //
  // it would render a request that looks like:
  //
  // /products/categories?filters=brand,val=gucci
  //
  asyncFetch(filterBy = "") {
    const fetchPath = this.searchStore.fetchPath || "products";
    // console.log(fetchPath, filterBy, this.fetchParams);
    return api.get(`${fetchPath}/${filterBy}`, this.fetchParams);
  }

  @action
  fetchColors() {
    // if top level category is set, fetch subcategory
    // this.colors.clear();
    this.asyncFetch("colors").then(response => {
      runInAction("[ACTION] fetch colors", () => {
        this.colors = (response && response.data) || [];
      });
    });
  }

  @action
  fetchSizes() {
    // if top level category is set, fetch subcategory
    this.asyncFetch("sizes").then(response => {
      runInAction("[ACTION] fetch sizes", () => {
        this.sizes = (response && response.data) || [];
      });
    });
  }

  @action
  fetchBrands() {
    this.asyncFetch("brands").then(response => {
      runInAction("[ACTION] fetch brands", () => {
        this.brands = (response && response.data) || [];
      });
    });
  }

  @action
  setSizeFilter(val) {
    this.size = val;
  }

  @action
  setColorFilter(val) {
    this.color = val;
  }

  @action
  setGenderFilter(val) {
    this._gender = val;
  }

  @action
  setBrandFilter(val) {
    this.brand = val;
    this.brands.clear();
  }

  @action
  setPriceFilter(min, max) {
    this.priceMin = min || undefined;
    this.priceMax = max || undefined;
  }

  @action
  setDiscountFilter(min) {
    var multiplier = Math.pow(10, 2);
    this.discountMin
      = min != null ? Math.round(min * multiplier) / multiplier : undefined;
  }

  @action
  setSortBy(sorter) {
    this.sortBy = sorter;
  }

  @action
  setScrollEnabled(enabled) {
    this.scrollEnabled = enabled;
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
  get gender() {
    return this._gender;
  }

  get isSearchSupported() {
    return !!this.searchStore && !!this.searchStore.reset;
  }

  @computed
  get fetchParams() {
    return {
      ...(this.sortBy && {
        sort: this.sortBy
      }),
      filter: [
        ...(this.priceMin !== undefined ? [`price,min=${this.priceMin}`] : []),
        ...(this.priceMax !== undefined ? [`price,max=${this.priceMax}`] : []),
        ...(this.discountMin !== undefined
          ? [`discount,min=${this.discountMin}`]
          : []),
        ...(this.gender ? [`gender,val=${this.gender}`] : []),
        ...(this.brand ? [`brand,val=${this.brand}`] : []),
        ...(this.color ? [`color,val=${this.color}`] : []),
        ...(this.size ? [`size,val=${this.size}`] : [])
      ]
    };
  }
}
