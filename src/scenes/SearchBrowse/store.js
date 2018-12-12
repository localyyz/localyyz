// custom
import { ApiInstance } from "localyyz/global";
import { capitalize } from "localyyz/helpers";
import { userStore } from "~/src/stores";

// third party
import { action } from "mobx";

// constants
const parseCategoryValues = values => {
  return (values || [])
    .map(v => ({
      ...v,
      id: v.type,
      title: capitalize(v.title || v.type)
    }))
    .slice();
};

export default class Store {
  @action
  fetchCategories = async () => {
    const response = await ApiInstance.get("categories");
    let categories = [];
    if (response.data) {
      categories = response.data.map(category => ({
        ...category,
        id: category.type,
        title: capitalize(category.title || category.type),
        data: parseCategoryValues(category.values)
      }));

      // sort MALE/FEMALE section based on user preference
      if (userStore.genderPreference) {
        categories.sort((a, b) => {
          if (a.value === userStore.genderPreference) {
            return -1;
          }
          return 1;
        });
      }
    }

    return new Promise.resolve({
      categories: categories,
      error: response.error
    });
  };

  @action
  fetchCategory = async categoryId => {
    const response = await ApiInstance.get(`categories/${categoryId}`);
    let category = {};
    if (response.data) {
      category = {
        ...response.data,
        id: response.data.type,
        title: capitalize(response.data.title || response.data.type),
        data: this.parseCategoryValues(response.data.values)
      };
    }
    return new Promise.resolve({
      category: category,
      error: response.error
    });
  };
}
