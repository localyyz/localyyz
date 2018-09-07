import { observable, runInAction } from "mobx";
import { invariant } from "fbjs/lib";

// custom
import { GA, ApiInstance } from "localyyz/global";

export default class CategoryStore {
  @observable categories = [];

  constructor() {
    this.basePath = "categories";
  }

  fetch = async () => {
    const resolved = await ApiInstance.get(this.basePath);
    if (!resolved.error) {
      runInAction("[ACTION] fetch categories", () => {
        this.categories = resolved.data;
      });
    }
    return resolved;
  };
}
