// custom
import { ApiInstance } from "~/src/global";
import { capitalize, box } from "~/src/helpers";
import { userStore, Collection } from "~/src/stores";

// third party
import shuffle from "lodash.shuffle";
import { runInAction, observable, action } from "mobx";
import { Animated } from "react-native";

import { Product } from "~/src/stores";

export default class HomeStore {
  @observable showNotfPrompt = false;
  @observable feed = [];

  fetchFeed = async () => {
    let rows = [];

    // postpend customizating rows
    if (userStore.needPersonalize) {
      if (!userStore.prf || !userStore.prf.gender) {
        rows = [{ id: "gender", type: "preference-full", value: "gender" }];
      }
    } else {
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
            let title;
            switch (row.type) {
              case "recommend":
                title = `Latest ${capitalize(row.style)} ${capitalize(
                  row.category.label
                )}`;
                break;
              case "sale":
                title = `${capitalize(row.style)} ${capitalize(
                  row.category.label
                )} On Sale`;
                break;
              case "favourite":
                title = row.title;
                break;
              default:
                title = row.title;
            }

            row = {
              ...row,
              title: title,
              products: row.products.map(
                p => new Product({ ...p, listTitle: title })
              )
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
    }

    runInAction("[ACTION] fetch featured collection feed", () => {
      this.feed.replace(rows);
      !this.showNotfPrompt
        && !userStore.needPersonalize
        && (this.showNotfPrompt = true);
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
