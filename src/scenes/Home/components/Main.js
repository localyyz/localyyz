import React from "react";
import { Animated, View, StyleSheet, FlatList } from "react-native";

// custom
import { NAVBAR_HEIGHT, Colours, Sizes } from "localyyz/constants";
import { ReactiveSpacer } from "localyyz/components";

// third party
import { observer, inject } from "mobx-react/native";

// local
import { Banner, Collection, Brands } from "../blocks";
import BlockSlider from "./BlockSlider";
import MainPlaceholder from "./MainPlaceholder";

// constants
const VIEWABLITY_CONFIG = {
  viewAreaCoveragePercentThreshold: 40
};

@inject(stores => ({
  homeStore: stores.homeStore,
  scrollAnimate: stores.homeStore.scrollAnimate,

  // blocks
  blocks: stores.homeStore.blocks,
  onViewableBlockChange: changes =>
    stores.homeStore.onViewableBlockChange(changes),
  updateBlockHeight: (i, evt) => stores.homeStore.updateBlockHeight(i, evt),

  // block fetching
  fetchCollectionBlocks: () => stores.homeStore.fetchCollectionBlocks()
}))
@observer
export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLayoutReady: false
    };

    // bindings
    this.scrollTo = this.scrollTo.bind(this);
    this.renderBlock = this.renderBlock.bind(this);
    this.onViewableBlockChange = this.onViewableBlockChange.bind(this);
    this.load = this.load.bind(this);
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    await this.props.fetchCollectionBlocks();

    // and finally allow render
    this.setState({ isLayoutReady: true });
  }

  onViewableBlockChange(changes) {
    return this.props.onViewableBlockChange(changes);
  }

  scrollTo(n) {
    this.refs.blocks
      && this.refs.blocks.scrollToIndex({
        index: n,
        viewOffset: Sizes.Height / 8,
        viewPosition: 0
      });
  }

  get renderBlocks() {
    return (
      <FlatList
        ref="blocks"
        data={this.props.blocks}
        keyExtractor={block => `block-${block.id}`}
        contentContainerStyle={styles.content}
        renderItem={this.renderBlock}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onViewableItemsChanged={this.onViewableBlockChange}
        viewabilityConfig={VIEWABLITY_CONFIG}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: {
                y: this.props.scrollAnimate
              }
            }
          }
        ])}/>
    );
  }

  renderBlock({ item: block, index: i }) {
    let component;
    switch (block.type) {
      case "header":
        component = (
          <ReactiveSpacer
            id={i}
            store={this.props.homeStore}
            heightProp="headerHeight"/>
        );
        break;
      case "productList":
        component = (
          <Collection
            {...block}
            withMargin
            id={i}
            fetchFrom={block.path}
            basePath={block.path}/>
        );
        break;
      case "collection":
        component = (
          <View
            style={i > 0 ? styles.blockContainer : styles.firstBlockContainer}>
            <Banner {...block} id={i} imageUri={block.imageUrl} />
            <Collection
              {...block}
              withMargin
              noMargin
              hideHeader
              fetchFrom={block.path}
              imageUrl={null}
              limit={4}/>
          </View>
        );
        break;
      case "brand":
        component = (
          <Brands
            {...block}
            id={i}
            limit={12}
            type={block.brandType}
            shouldShowName={!!block.shouldShowName}/>
        );
        break;
    }

    return (
      <View onLayout={evt => this.props.updateBlockHeight(i, evt)}>
        {component}
      </View>
    );
  }

  render() {
    return this.state.isLayoutReady ? (
      <View style={styles.container}>
        <View style={styles.contentContainer}>{this.renderBlocks}</View>
        <View style={styles.slider}>
          <BlockSlider scrollTo={this.scrollTo} />
        </View>
      </View>
    ) : (
      <MainPlaceholder />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  contentContainer: {
    flex: 1
  },

  slider: {
    position: "absolute",
    bottom: 0
  },

  content: {
    backgroundColor: Colours.Background,
    paddingBottom: NAVBAR_HEIGHT
  },

  blockContainer: {
    marginVertical: Sizes.InnerFrame / 2
  },

  firstBlockContainer: {
    marginBottom: Sizes.InnerFrame / 2
  }
});
