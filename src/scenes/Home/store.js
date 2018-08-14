// custom
import { ApiInstance } from "localyyz/global";
import { box, randInt } from "localyyz/helpers";

// third party
import { observable, action, runInAction, computed } from "mobx";
import { Animated } from "react-native";

export default class HomeStore {
  constructor() {
    this.api = ApiInstance;
  }

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
    {
      type: "productList",
      path: "products/feed",
      title: "Just for you"
    }
  ];
  @observable currentBlock;

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
