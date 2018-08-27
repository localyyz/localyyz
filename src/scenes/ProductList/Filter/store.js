import {
  runInAction,
  action,
  observable,
  computed,
  reaction,
  get,
  set
} from "mobx";
import { GA, ApiInstance as api } from "localyyz/global";

// constants
// inconsistency between user settings and filters from API
const GENDER_MAPPING = { male: "man", female: "woman" };

export default class FilterStore {
  // sorting
  @observable sortBy;

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
  @observable category;
  @observable subcategory;
  @observable merchant;

  // lists
  @observable genders = ["man", "woman"];
  @observable
  sortBys = [
    { label: "Recommended" },
    { label: "What's new", value: "-created_at" },
    { label: "Price (Low to high)", value: "price" },
    { label: "Price (High to low)", value: "-price" },
    { label: "Discount (High to low, % off)", value: "-discount" }
  ];
  @observable brands = [];
  @observable colors = [];
  @observable
  sizes = [
    /* M, L, S */
  ];
  @observable
  categories = observable.object({
    /*
     * "apparel": [ "blazers", "shirts" ],
     */
  });
  @observable merchants = [];
  @observable
  prices = [
    { min: 1, max: 25 },
    { min: 25, max: 50 },
    { min: 50, max: 100 },
    { min: 100, max: 150 },
    { min: 150, max: 250 },
    { min: 250, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 2500 },
    { min: 2500, max: 5000 },
    { min: 5000 }
  ];
  @observable
  sales = [
    { min: 1 },
    { min: 20 },
    { min: 30 },
    { min: 40 },
    { min: 50 },
    { min: 60 },
    { min: 70 }
  ];
  // TODO: make section list:
  //  sales %
  //  new sales
  //  deals -> free shipping

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

    // set gender from settings on mount, can be
    // overrided
    let gender = defaultGender || (userStore && userStore.gender);
    gender = GENDER_MAPPING[gender];
    gender && this.setGenderFilter(gender);
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
    count += this.category ? 1 : 0;
    count += this.merchant ? 1 : 0;
    return count;
  }

  // filter reaction catches filter changes and refetches the
  // parent store
  filterReaction = reaction(
    () => this.fetchParams,
    params => this.refresh(null, params),
    { delay: 500 }
  );

  reset(fetchPath) {
    this.setSizeFilter();
    this.setBrandFilter();
    this.setColorFilter();
    this.setDiscountFilter();
    this.setPriceFilter();
    this.setCategoryFilter();
    this.setMerchantFilter();

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
  asyncFetch(filterBy = "", params = {}) {
    const fetchPath = this.searchStore.fetchPath || "products";
    return api.get(`${fetchPath}/${filterBy}`, {
      ...this.fetchParams,
      ...params
    });
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
  fetchCategories = () => {
    // if top level category is set, fetch subcategory
    // this.colors.clear();
    this.asyncFetch("categories").then(response => {
      runInAction("[ACTION] fetch categories", () => {
        for (let category of response.data) {
          let subcategory = get(this.categories, category) || [];
          set(this.categories, category, subcategory);
        }
      });
    });
  };

  @action
  fetchSubcategories = category => {
    this.asyncFetch("subcategories").then(response => {
      runInAction("[ACTION] fetch subcategories", () => {
        set(this.categories, category, response.data);
      });
    });
  };

  @action
  fetchMerchants = () => {
    this.asyncFetch("stores").then(response => {
      runInAction("[ACTION] fetch merchants", () => {
        this.merchants = (response && response.data) || [];
      });
    });
  };

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
  setCategoryFilter = category => {
    GA.trackEvent("filter/sort", "filter by category", category || "all");
    this.category = category;
    this.subcategory = undefined;
  };

  @action
  setSubcategoryFilter = subcategory => {
    GA.trackEvent(
      "filter/sort",
      "filter by category",
      subcategory || this.category || "all"
    );
    this.subcategory = subcategory;
  };

  @action
  setMerchantFilter = val => {
    this.merchant = val;
  };

  @action
  setPriceFilter(min = 0, max) {
    this.priceMin = min;
    this.priceMax = max;
  }

  @action
  setDiscountFilter(min = 0) {
    this.discountMin = min;
  }

  @action
  setSortBy = sorter => {
    GA.trackEvent("filter/sort", "sort", sorter);
    this.sortBy = sorter;
  };

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
        ...(this.size ? [`size,val=${this.size}`] : []),
        ...(this.category ? [`categoryType,val=${this.category}`] : []),
        ...(this.subcategory ? [`categoryValue,val=${this.subcategory}`] : []),
        ...(this.merchant ? [`merchant,val=${this.merchant}`] : [])
      ]
    };
  }
}