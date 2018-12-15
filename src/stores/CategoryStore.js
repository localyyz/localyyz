//import { runInAction } from "mobx";

// custom
import { capitalize } from "~/src/helpers";
import { GA, ApiInstance } from "~/src/global";

export default class CategoryStore {
  static fetchOne = async categoryId => {
    return ApiInstance.get(`categories/${categoryId}`).then(response => {
      return new Promise.resolve({
        category: response.data,
        error: response.error
      });
    });
  };

  static fetch = async () => {
    const response = await ApiInstance.get("categories");
    let categories = [];

    if (response.data) {
      categories = response.data.map(category => ({
        ...category,
        data: category.values
      }));
    }

    return new Promise.resolve({
      categories: categories,
      error: response.error
    });
  };

  constructor(props) {
    this.title = props.title;
    this.imageUrl = props.imageUrl;
    this.id = props.id;
    this.data = this.parseValues(props.values);
  }

  parseValues = values => {
    return (values || [])
      .filter(v => v.imageUrl)
      .map(v => ({
        ...v,
        id: v.type,
        title: capitalize(v.title || v.type),
        data: (v.values || []).length > 0 ? this.parseValues(v.values) : []
      }))
      .slice();
  };
}
