// custom
import { userStore, Category } from "~/src/stores";

export default class Store {
  fetchCategories = async () => {
    return Category.fetch().then(resolved => {
      let categories = resolved.categories;
      if (categories) {
        // sort MALE/FEMALE section based on user preference
        if (userStore.genderPreference) {
          categories.sort(a => {
            if (a.value === userStore.genderPreference) {
              return -1;
            }
            return 1;
          });
        }
      }
      return new Promise.resolve({
        error: resolved.error,
        categories: categories
      });
    });
  };
}
