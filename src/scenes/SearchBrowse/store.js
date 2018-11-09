// custom
import { ApiInstance } from "localyyz/global";
import { userStore } from "localyyz/stores";
import { capitalize } from "localyyz/helpers";

// third party
import { observable, action, runInAction, computed } from "mobx";

// constants

export default class Store {
  constructor() {
    // default: female
    //  or respect user choices
    this.gender
      = userStore && userStore.gender
        ? userStore.gender === "male"
          ? { id: "male", filterId: "man" }
          : { id: "female", filterId: "woman" }
        : { id: "female", filterId: "woman" };
  }

  /////////////////////////////////// category states below
  // mobx array works weird with SectionList.. need to make shallow
  @observable.shallow categories = [];
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
    this.gender = gender;

    // trigger refresh of categories
    this.fetchCategories();
  };

  parseCategoryValues = values => {
    return (values || [])
      .filter(v => v.imageUrl)
      .map(v => ({
        ...v,
        id: v.type,
        title: capitalize(v.title || v.type)
        //data:
        //(v.values || []).length > 0 ? this.parseCategoryValues(v.values) : []
      }))
      .slice();
  };

  @action
  fetchCategories = async () => {
    const response = await ApiInstance.get(
      "categories",
      this.fetchCategoriesParams
    );
    if (response.status < 400 && response.data && response.data.length > 0) {
      runInAction("[ACTION] fetch categories", () => {
        this.categories = response.data.map(category => ({
          ...category,
          id: category.type,
          title: capitalize(category.title || category.type),
          data: this.parseCategoryValues(category.values)
        }));
      });
    }
    return new Promise.resolve({
      categories: this.categories,
      error: response.error
    });
  };
}
