//import { runInAction } from "mobx";

// custom
import { capitalize } from "~/src/helpers";
import { GA, ApiInstance } from "~/src/global";

export default class CategoryStore {
  static fetchCategories = async path => {
    const resolved = await ApiInstance.get(path);
    if (!resolved.error) {
      return Promise.resolve({
        categories: resolved.data.values.map(c => new CategoryStore(c))
      });
    }
    return Promise.resolve({ error: resolved.error });
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
