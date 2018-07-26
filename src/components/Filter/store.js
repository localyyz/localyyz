import { runInAction, action, observable, computed, reaction } from "mobx";
import { ApiInstance as api } from "localyyz/global";
import { capitalize } from "localyyz/helpers";

// constants
// inconsistency between user settings and filters from API
const GENDER_MAPPING = { male: "man", female: "woman", unisex: "unisex" };

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

  // category filters
  @observable category;
  @observable subcategory;

  // other filters
  @observable brand;
  @observable size;
  @observable color;

  // lists
  @observable categories = [];
  @observable brands = [];
  @observable colors = [];
  @observable sizes = [];

  // ui
  @observable scrollEnabled;

  constructor(searchStore, userStore, defaultGender) {
    // requires .reset(params) and .numProducts
    this.searchStore = searchStore;

    // bindings
    this.refresh = this.refresh.bind(this);
    this.asyncFetch = this.asyncFetch.bind(this);

    this.fetchColors = this.fetchColors.bind(this);
    this.fetchSizes = this.fetchSizes.bind(this);
    this.fetchCategories = this.fetchCategories.bind(this);
    this.fetchBrands = this.fetchBrands.bind(this);

    this.setCategoryFilter = this.setCategoryFilter.bind(this);
    this.clearCategoryFilter = this.clearCategoryFilter.bind(this);
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
    params => {
      if (this.isSearchSupported) {
        // TODO: offload this to APPLY press. -> backend will have to passback
        // # of products on filter calls
        this.searchStore.reset(params);
      }
      // refetch filters based on the current filter params
      // only if nothing is selected for that filter
      //this.brand ? null : this.fetchBrands();
      //this.color ? null : this.fetchColors();
      //this.size ? null : this.fetchSizes();

      this.fetchCategories();
    }
  );

  @action
  refresh() {
    if (this.isSearchSupported) {
      this.searchStore.reset(this.fetchParams);
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
    this.colors.clear();
    this.asyncFetch("colors").then(response => {
      runInAction("[ACTION] fetch colors", () => {
        this.colors = (response && response.data) || [];
      });
    });
  }

  @action
  fetchSizes() {
    // if top level category is set, fetch subcategory
    this.sizes.clear();
    this.asyncFetch("sizes").then(response => {
      runInAction("[ACTION] fetch sizes", () => {
        this.sizes = (response && response.data) || [];
      });
    });
  }

  @action
  fetchCategories() {
    // if top level category is set, fetch subcategory
    this.categories.clear();
    let fetchPath = this.category ? "subcategories" : "categories";
    this.asyncFetch(fetchPath).then(response => {
      runInAction("[ACTION] fetch categories", () => {
        this.categories = response.data.map(value => ({
          title: capitalize(value),
          value: value
        }));
      });
    });
  }

  @action
  fetchBrands() {
    this.brands.clear();
    this.asyncFetch("brands").then(response => {
      runInAction("[ACTION] fetch brands", () => {
        this.brands = (response && response.data) || [];
      });
    });
  }

  @action
  setCategoryFilter(val) {
    // TODO: this is pretty magical. clean it up
    this.category ? (this.subcategory = val) : (this.category = val);
  }

  @action
  clearCategoryFilter() {
    // TODO: probably should separate this out..
    //
    // clear subcategory if it's set, else clear category
    this.subcategory ? (this.subcategory = "") : (this.category = "");
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
        ...(this.category ? [`categoryType,val=${this.category}`] : []),
        ...(this.subcategory ? [`categoryValue,val=${this.subcategory}`] : []),
        ...(this.brand ? [`brand,val=${this.brand}`] : []),
        ...(this.color ? [`color,val=${this.color}`] : []),
        ...(this.size ? [`size,val=${this.size}`] : [])
      ]
    };
  }
}
