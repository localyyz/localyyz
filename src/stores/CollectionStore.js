import { GA, ApiInstance } from "~/src/global";
import CollectionModel from "../models/Collection";

export default class CollectionStore extends CollectionModel {
  static fetch = async collectionId => {
    const resolve = await ApiInstance.get(`/collections/${collectionId}`);
    if (!resolve.error) {
      // app.js trackScreen is also handling product view events
      return new Promise.resolve({
        collection: new CollectionStore(resolve.data)
      });
    }
    return new Promise.resolve({ error: resolve.error });
  };

  constructor(collection) {
    super(collection);
    GA.trackEvent("collection", "view", this.title);
  }
}
