import { GA, ApiInstance } from "~/src/global";
import CollectionModel from "../models/Collection";

export default class CollectionStore extends CollectionModel {
  static fetch = async collectionId => {
    const resolve = await ApiInstance.get(`/collections/${collectionId}`);
    if (!resolve.error) {
      GA.trackEvent("collection", "view", this.title);
      return new Promise.resolve({
        collection: new CollectionStore(resolve.data)
      });
    }
    return new Promise.resolve({ error: resolve.error });
  };

  static fetchFeatured = async () => {
    const resolve = await ApiInstance.get("/collections/featured");
    if (!resolve.error) {
      return new Promise.resolve({
        collections: resolve.data.map(c => new CollectionStore(c))
      });
    }
    return new Promise.resolve({ error: resolve.error });
  };

  constructor(props) {
    super(props);
  }
}
