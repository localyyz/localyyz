// custom
import { Product } from "localyyz/models";
import { ApiInstance } from "localyyz/global";
import { assistantStore } from "localyyz/stores";
import { box, capitalize, randInt } from "localyyz/helpers";
import {
  Sizes,
  SEARCH_SUGGESTIONS_FEMALE,
  SEARCH_SUGGESTIONS_MALE
} from "localyyz/constants";

// third party
import { observable, action, runInAction, reaction, computed } from "mobx";
import { Animated, Easing } from "react-native";

const PAGE_LIMIT = 8;
const PAGE_ONE = 1;
const SEARCH_DELAY = 2000;

export const DEFAULT_BLOCKS = [
  {
    type: "brand",
    id: "brands",
    brandType: "designers",
    title: "Brands",
    description: "Browse the thousands of brands available on the Localyyz app",
    numBrands: 10000
  }
];

export default class HomeStore {
  constructor() {
    this.api = ApiInstance;

    // bindings
    this.changeGenderSuggestions = this.changeGenderSuggestions.bind(this);
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

  /////////////////////////////////// search suggestion observables
  @box currentSuggestion = 0;
  @observable searchSuggestions = SEARCH_SUGGESTIONS_FEMALE;

  @action
  changeGenderSuggestions(gender) {
    this.searchSuggestions
      = gender === "male" ? SEARCH_SUGGESTIONS_MALE : SEARCH_SUGGESTIONS_FEMALE;
  }

  /////////////////////////////////// search observables

  @box searchQuery = "";
  @box searchResults = [];
  @box numProducts = 0;
  // internal values
  // next: marks the next page value
  // hasNextPage: for search, the backend link value isn't reliable,
  //  backend gives a truthy has next page because it trades accuracy for
  //  speed
  // processing: onEndReached would be incorrectly triggered as list items
  //  starts to load, need to switch to a loading state to not over load

  @box _processing = false;

  _nextSearch;
  _selfSearch;

  reactSearch = reaction(() => this.searchQuery, () => this.reset(), {
    delay: SEARCH_DELAY
  });

  reset = params => {
    if (this.searchQuery.length > 0) {
      // on new search, reset internal values and search result
      this._nextSearch = null;
      this._selfSearch = null;
      this._processing = false;
      this.searchResults.clear();

      // fetch new result
      this.fetchNextPage(params);
    }
  };

  @computed
  get isProcessingQuery() {
    return (
      !!this._processing && (this.selfSearch && this.selfSearch.page === 1)
    );
  }

  fetchNextPage = params => {
    if (this._processing || (this._selfSearch && !this._nextSearch)) {
      console.log(
        `skip page fetch already loading or reached end. l:${
          this._processing
        } n:${this._nextSearch}`
      );
      return;
    }

    this._processing = true;

    this.api
      .post(
        (this._nextSearch && this._nextSearch.url) || "search",
        { query: this.searchQuery },
        { ...params, limit: PAGE_LIMIT }
      )
      .then(response => {
        if (response && response.status < 400 && response.data.length > 0) {
          runInAction("[ACTION] post search", () => {
            // product count
            if (response.headers && response.headers["x-item-total"] != null) {
              this.numProducts
                = parseInt(response.headers["x-item-total"]) || 0;
            }

            this.searchResults = [
              ...this.searchResults.slice(),
              ...this._listProducts(response.data)
            ];
          });

          this._nextSearch = response.link.next;
          this._selfSearch = response.link.self;
        } else {
          // TODO: backend should sendback a http status hinting no results
          if (!this._selfSearch || this._selfSearch.page === PAGE_ONE) {
            assistantStore.write(
              `Sorry! I couldn't find any product for "${this.searchQuery}"`,
              5000
            );
          }
        }

        this._processing = false;
      })
      .catch(console.log);
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
  @observable blocks = DEFAULT_BLOCKS;
  @observable currentBlock;

  // NOTE/TODO: what is this for???
  hasFetchedCategory = false;

  @action
  async fetchCategoryBlocks() {
    if (!this.hasFetchedCategory) {
      this.hasFetchedCategory = true;
      let response = await this.api.get("categories", null, true);
      if (response.status < 400 && response.data && response.data.length > 0) {
        let categoryBlocks = response.data.map(category => ({
          type: "productList",
          categories: category.values.map(v => ({
            type: v,
            fetchPath: `categories/${category.type}`
          })),
          id: category.type,

          // used to differentiate from locally specified
          _fetched: true,
          title: capitalize(category.type),
          basePath: `categories/${category.type}`,
          path: `categories/${category.type}/products`,
          limit: 4
        }));

        return await runInAction(
          "[ACTION] appending category blocks to layout",
          () => {
            this.blocks = [
              ...this.filterBlocks(this.blocks, "productList"),
              ...categoryBlocks
            ];
          }
        );
      }
    }
  }

  filterBlocks(blocks, type) {
    return blocks.filter(block => block.type !== type || !block._fetched);
  }

  @action
  async fetchCollectionBlocks() {
    let response = await this.api.get("collections");
    if (response.status < 400 && response.data && response.data.length > 0) {
      // first one is always at the top
      let insertBlockIndex = 0;
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
        insertBlockIndex
          = randInt(blocks.length - (insertBlockIndex + 2))
          + (insertBlockIndex + 2);
      }

      // update blocks layout with inserted collections scattered randomly
      // and header
      return await runInAction(
        "[ACTION] appending category blocks randomly to layout",
        () => {
          this.blocks = blocks;
        }
      );
    }
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
    if (
      currentlyVisibleBlock
      && currentlyVisibleBlock.index !== this.currentBlock
    ) {
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
          { duration: 500, easing: Easing.out(Easing.ease) }
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
