import {
  action,
  runInAction,
  observable,
  computed,
  extendObservable
} from "mobx";
import { storage } from "localyyz/effects";
import { Product } from "localyyz/models";
import { ApiInstance } from "localyyz/global";

// third party
import Moment from "moment";

// constants
const HISTORY_KEY = "browseHistory";
const HISTORY_EXPIRY_MONTHS = 3;
const HISTORY_ITEMS_LIMIT = 100;

const historyItem = product => ({
  productId: product.id,
  price: product.price,
  lastViewed: Moment().valueOf()
});

export default class HistoryStore {
  // history is an array of stored historyItems
  @observable history = [];

  // products is a lookup map of product models keyed on id
  // ie: { 123: Product(...) }
  @observable products = {};

  constructor() {
    this.api = ApiInstance;
    this.fetchHistory();
  }

  @action
  fetchHistory = async () => {
    let historyFromStorage = (await storage.load(HISTORY_KEY)) || {};

    // strip out caching info
    delete historyFromStorage.cachedAt;
    historyFromStorage = Object.values(historyFromStorage)
      .sort((a, b) => (a.lastViewed < b.lastViewed ? 1 : -1))
      .slice(0, HISTORY_ITEMS_LIMIT);

    await runInAction("[ACTION] Loading history from storage", () => {
      this.history = historyFromStorage;
    });

    // grab new products not already in this.products
    await this.fetchProducts({
      productIds: historyFromStorage
        .map(item => item.productId)
        .filter(item => !this.products[item])
        .join(",")
    });

    // and out
    return historyFromStorage;
  };

  @action
  log = async product => {
    await runInAction("[ACTION] Logging product view", () => {
      this.products[product.id] = product;
      this.history = [historyItem(product), ...this.history]
        .filter(
          item =>
            Moment().diff(Moment(item.lastViewed), "months") <
            HISTORY_EXPIRY_MONTHS
        )
        .slice(0, HISTORY_ITEMS_LIMIT);

      // and save it
      storage.save(
        HISTORY_KEY,
        this.history
          .filter(item => item.lastViewed)
          .slice()
          .reduce((acc, item) => {
            acc[item.lastViewed] = item;
            return acc;
          }, {})
      );
    });
  };

  fetchProducts = async payload => {
    // only grab if not present
    const response = await this.api.get("/products/history", payload);
    if (response && response.data) {
      for (let product of response.data) {
        extendObservable(this.products, {
          [product.id]: new Product(product).changeTitleWordsLength(6)
        });
      }
    }
  };

  @computed
  get groups() {
    return this.history.filter(item => item.lastViewed).reduce((acc, item) => {
      let label;
      let daysAgo = Moment().diff(Moment(item.lastViewed), "days");
      let minutesAgo = Moment().diff(Moment(item.lastViewed), "minutes");
      let formattedDate = Moment(item.lastViewed).format("MMMM Do, YYYY");

      // bundle in appropriate grouping
      switch (true) {
        case minutesAgo < 15:
          label = "Last 15 minutes";
          break;
        case daysAgo < 1:
          label = "Today";
          break;
        case daysAgo < 2:
          label = "Yesterday";
          break;
        case daysAgo < 8:
          label = "This week";
          break;
        case daysAgo < 32:
          label = "This month";
          break;
        case formattedDate !== "Invalid date":
          label = formattedDate;
          break;
      }

      // only allow most recently seen, ordering dependant on sort order on
      // first line
      if (
        label &&
        (acc[label] || []).findIndex(e => e.productId === item.productId) < 0
      )
        acc[label] = [...(acc[label] || []), item];

      // and out
      return acc;
    }, {});
  }
}
