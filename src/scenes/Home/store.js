// custom
import { Product } from "localyyz/models";
import { ApiInstance } from "localyyz/global";
import { assistantStore } from "localyyz/stores";
import { box, capitalize, randInt } from "localyyz/helpers";
import { Sizes } from "localyyz/constants";

// third party
import { observable, action, runInAction, reaction, computed } from "mobx";
import { Animated, Easing } from "react-native";

const PAGE_LIMIT = 8;
const PAGE_ONE = 1;
const SEARCH_DELAY = 1500;

export default class HomeStore {
  constructor() {
    this.api = ApiInstance;
  }

  _listProducts = listData => {
    return (listData || [])
      .filter(p => {
        return p.images && p.images.length > 0;
      })
      .map(
        p =>
          new Product({
            ...p,
            description: p.noTagDescription,
            titleWordsLength: 3,
            descriptionWordsLength: 10
          })
      );
  };

  /////////////////////////////////// search observables

  @box searchQuery = "";
  @box searchResults = [];
  // internal values
  // next: marks the next page value
  // hasNextPage: for search, the backend link value isn't reliable,
  //  backend gives a truthy has next page because it trades accuracy for
  //  speed
  // processing: onEndReached would be incorrectly triggered as list items
  //  starts to load, need to switch to a loading state to not over load

  _next = 1;
  _hasNextPage = true;
  _processing = false;

  reactSearch = reaction(
    () => this.searchQuery,
    searchQuery => {
      if (searchQuery.length > 0) {
        // on new search, reset internal values and search result
        this._next = 1;
        this._hasNextPage = true;
        this._processing = false;
        this.searchResults.clear();

        // fetch new result
        this.fetchNextPage();
      }
    },
    { delay: SEARCH_DELAY }
  );

  fetchNextPage = () => {
    if (this._hasNextPage && !this._processing) {
      this._processing = true;

      this.api
        .post(
          "search",
          { query: this.searchQuery },
          { page: this._next, limit: PAGE_LIMIT }
        )
        .then(response => {
          if (response && response.status < 400 && response.data.length > 0) {
            runInAction("[ACTION] post search", () => {
              this.searchResults = [
                ...this.searchResults.slice(),
                ...this._listProducts(response.data)
              ];
            });
            this._next++;
          } else {
            if (this._next === PAGE_ONE) {
              assistantStore.write(
                `Sorry! I couldn't find any product for "${this.searchQuery}"`,
                5000
              );
            }
          }

          // NOTE: because search returns "estimated" number of pages, can't
          // rely on the provided next pages as indicator if there is next page
          this._hasNextPage
            = response.data && response.data.length === PAGE_LIMIT;
          this._processing = false;
        })
        .catch(console.log);
    }
  };

  /////////////////////////////////// shared UI states below

  // UI states shared between components
  // NOTE: updated by Header component onLayout
  @box headerHeight = 0;
  // determines if the search results UI is visible
  @box scrollAnimate = new Animated.Value(0);
  _previousScrollAnimate = 0;

  @box searchActive = false;
  @box searchFocused = false;

  // blocks horizontal scroller and blocks registry
  // all blocks have the following min props: type
  @observable
  blocks = [
    { type: "header" },
    // {
    //   type: "photo",
    //   uri:
    //     "http://swaysuniverse.com/wp-content/uploads/2017/01/bape-2017-spring-summer-collection-1.jpeg",
    //   offset: -200
    // },
    {
      type: "productList",
      id: "today-finds",
      title: "Today's finds",
      description:
        "Hand selected daily for you by our team of fashionistas based on what you've viewed before",
      path: "products/curated",
      limit: 6
    },
    {
      type: "brand",
      id: "brands",
      brandType: "designers",
      title: "Brands",
      description:
        "Browse the thousands of brands available on the Localyyz app",
      numBrands: 10000
    },
    // {
    //   type: "photo",
    //   uri:
    //     "http://swaysuniverse.com/wp-content/uploads/2017/01/bape-2017-spring-summer-collection-1.jpeg"
    // },
    {
      type: "productList",
      id: "on-sales",
      title: "Limited time offers",
      description:
        "Watch this space for the hottest promotions and sales posted the minute they're live on Localyyz",
      path: "products/onsale",
      limit: 10
    },
    {
      type: "brand",
      id: "merchants",
      brandType: "places",
      shouldShowName: true,
      title: "Merchants on Localyyz",
      description:
        "Browse the hundreds of merchants available on the Localyyz app",
      numBrands: 100
    }
  ];
  @observable currentBlock;

  hasFetchedCategory = false;

  @action
  fetchCategoryBlocks() {
    if (!this.hasFetchedCategory) {
      this.hasFetchedCategory = true;
      this.api.get("categories").then(response => {
        if (
          response.status < 400
          && response.data
          && response.data.length > 0
        ) {
          let categoryBlocks = response.data.map(category => ({
            type: "productList",
            categories: category.values,
            id: category.type,

            // used to differentiate from locally specified
            _fetched: true,
            title: capitalize(category.type),
            basePath: `categories/${category.type}`,
            path: `categories/${category.type}/products`,
            limit: 4
          }));

          runInAction("[ACTION] appending category blocks to layout", () => {
            this.blocks = [
              ...this.filterBlocks(this.blocks, "productList"),
              ...categoryBlocks
            ];
          });
        }
      });
    }
  }

  filterBlocks(blocks, type) {
    return blocks.filter(block => block.type !== type || !block._fetched);
  }

  @action
  fetchCollectionBlocks() {
    this.api.get("collections").then(response => {
      if (response.status < 400 && response.data && response.data.length > 0) {
        // first one is always at the top
        let insertBlockIndex = 1;
        let blocks = this.filterBlocks(this.blocks.slice(), "collection");

        // insert the remaining ones randomly across the block layout
        for (let collection of response.data) {
          blocks.splice(insertBlockIndex, 0, {
            ...collection,
            type: "collection",
            path: `collections/${collection.id}/products`,
            title: collection.name
          });

          // starting at second item, since don't want before first and spacer,
          // and immediately after first
          //
          // TODO: don't allow two collections beside each other
          insertBlockIndex = randInt(blocks.length - 3) + 3;
        }

        // update blocks layout with inserted collections scattered randomly
        // and header
        runInAction(
          "[ACTION] appending category blocks randomly to layout",
          () => {
            this.blocks = blocks;
          }
        );
      }
    });
  }

  @computed
  get trackedBlocks() {
    return this.blocks
      .map((block, i) => ({ ...block, actualId: i }))
      .filter(block => block.title);
  }

  @computed
  get currentTrackedBlock() {
    return (
      (this.blocks.slice(0, this.currentBlock + 1).filter(block => block.title)
        .length || 1) - 1
    );
  }

  getActualBlockFromTrackedBlock = i => {
    return this.trackedBlocks[i].actualId;
  };

  getBlockPosition = i =>
    this.blocks
      .slice(0, i)
      .map(block => block._height)
      .filter(height => height && height > 0)
      .reduce((a, b) => a + b, 0);

  @action
  updateBlockHeight(i, { nativeEvent: { layout: { height } } }) {
    this.blocks[i]._height = height;
  }

  @action
  onViewableBlockChange = ({ viewableItems }) => {
    let currentlyVisibleBlock = viewableItems[viewableItems.length - 1];

    // only update if changing
    if (currentlyVisibleBlock.index !== this.currentBlock) {
      this.currentBlock = currentlyVisibleBlock.index;

      // update internal block height for all visible blocks
      viewableItems.map(blockItem => {
        this.blocks[blockItem.index]._position = this.getBlockPosition(
          blockItem.index
        );
      });

      runInAction(
        "[ACTION] updating positions on viewable block change",
        () => {
          this.currentBlock = currentlyVisibleBlock.index;
          this.blocks = this.blocks.slice();
        }
      );
    }
  };

  // react header scroll reacts to "searchActive" value changes
  // when true:
  //     records the previous header height and
  //     animates the header height and opacity to a minimum
  // when false:
  //     scrolls to the previous header height
  reactHeaderScroll = reaction(
    () => this.searchActive,
    searchActive => {
      if (searchActive) {
        // header is minimizing --->
        // save the previous scroll location
        this._previousScrollAnimate = this.scrollAnimate._value;

        // update the animate value
        Animated.timing(
          this.scrollAnimate,
          {
            toValue: Sizes.Height
          },
          { duration: 500, easing: Easing.in(Easing.ease) }
        ).start();
      } else {
        // header is maximizing --->
        // update the animate value to previously saved height
        Animated.timing(this.scrollAnimate, {
          toValue: this._previousScrollAnimate
        }).start();
        this._previousScrollAnimate = 0;
      }
    }
  );

  @box searchTagsVisible = true;

  //////////////////////////////////////////////////////////
}
