// custom
import { ApiInstance } from "~/src/global";
import { box } from "~/src/helpers";
import { Collection } from "~/src/stores";

// third party
import shuffle from "lodash.shuffle";
import { runInAction, observable, action } from "mobx";
import { Animated } from "react-native";

import { Product } from "~/src/stores";

export default class HomeStore {
  @observable feed = [];

  fetchFeed = async () => {
    let rows = [];
    let orderedRows = [];

    // featured collections is part of feed.
    let resolved = await Collection.fetchFeatured();
    if (resolved.collections) {
      rows = resolved.collections.map(c => ({ ...c, type: "collection" }));
      // removes the first element, if exists, put it into orderedRows
      let topCollection = rows.shift();
      topCollection && orderedRows.push(topCollection);
    }

    resolved = await ApiInstance.get("/products/feedv3");
    if (resolved.error) {
      return Promise.resolve({ error: resolved.error });
    }

    rows = rows.concat(
      resolved.data
        .map(row => {
          row = {
            ...row,
            products: row.products.map(p => new Product(p))
          };
          if (row.order) {
            orderedRows.push(row);
            return;
          }
          return row;
        })
        .filter(r => r)
    );

    // do the shuffle shuffle
    rows = shuffle(rows);
    rows = [...orderedRows, ...rows];

    runInAction("[ACTION] fetch featured collection feed", () => {
      this.feed.replace(rows);
    });

    return Promise.resolve({ success: true });
  };

  // sync up another components scroll with this animated value
  @box scrollAnimate = new Animated.Value(0);
  @action
  onScrollAnimate = Animated.event([
    {
      nativeEvent: {
        contentOffset: {
          y: this.scrollAnimate
        }
      }
    }
  ]);

  //////////////////////////////////////////////////////////
}
