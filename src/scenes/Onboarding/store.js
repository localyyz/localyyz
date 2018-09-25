// third party
import { computed, observable, action, runInAction } from "mobx";

// custom
import { ApiInstance } from "~/src/global";
import { capitalize } from "~/src/helpers";
import { Merchant } from "~/src/stores";

// constants
export const PickMinCount = 5;
export const MinFollowCount = 3;

export default class Store {
  @observable.shallow
  categories = [
    {
      id: 20000,
      value: "woman",
      label: "Woman's Fashion",
      data: []
    },
    {
      id: 10000,
      value: "man",
      label: "Men's Fashion",
      data: []
    },
    { id: 3, value: "newin", label: "New In", data: [] },
    { id: 4, value: "trend", label: "Trending", data: [] },
    {
      id: 5,
      value: "bestsell",
      label: "Best Sellers",
      data: []
    },
    { id: 6, value: "bestdeal", label: "Best Deals", data: [] }
  ];
  @observable selected = observable.map({});
  @observable merchants = [];
  @observable isLoading = false;

  @computed
  get selectedCount() {
    return this.selected.size;
  }

  @computed
  get favouriteCount() {
    return this.merchants.slice().filter(m => m.isFavourite).length;
  }

  get selectedCategories() {
    let s = [];
    this.selected.forEach((value, key) => {
      if (value) {
        s.push(key);
      }
    });
    return s;
  }

  @action
  fetchMerchants = async () => {
    if (this.isLoading || (this.self && !this.next)) {
      // end of page!
      return;
    }
    this.isLoading = true;
    const path = this.next ? this.next.url : "categories/merchants";
    let payload = {
      categories: this.selectedCategories
    };
    const resolved = await ApiInstance.post(path, payload, { limit: 5 });
    if (!resolved.error) {
      // eslint-disable-next-line
      this.next = resolved.link && resolved.link.next;
      this.self = resolved.link && resolved.link.self;
      runInAction("merchant", () => {
        resolved.data.forEach(m => this.merchants.push(new Merchant(m)));
      });
    }
    this.isLoading = false;
    return Promise.resolve({ error: resolved.error });
  };

  selectCategory = category => {
    this.selected.set(category.id, true);
    // remove the parent category
    this.selected.set(category.parentId, false);
  };

  @action
  storeUserCategory = async () => {
    const resolved = await ApiInstance.put("users/me/categories", {
      categories: this.selectedCategories
    });
    if (!resolved.error) {
      return Promise.resolve({ success: true });
    }
    return Promise.resolve({ error: resolved.error });
  };

  @action
  fetchCategory = async (category, index) => {
    if (this.selected.has(category.id)) {
      return;
    }
    this.selectCategory(category);

    const fetchPath = `categories/${category.id}`;
    const resolved = await ApiInstance.get(fetchPath, {}, true);
    if (!resolved.error) {
      runInAction("[ACTION] fetch categories", () => {
        let topics = resolved.data.values.map((d, i) => ({
          ...d,
          parentId: category.id,
          label: capitalize(d.label),
          batchIdx: i,
          data: d.values.map(v => ({
            ...v,
            label: capitalize(v.label),
            parentId: d.id
          }))
        }));
        this.categories.splice(index + 1, 0, ...topics);
      });
    }
    return resolved;
  };
}
