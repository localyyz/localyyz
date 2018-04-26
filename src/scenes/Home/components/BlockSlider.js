import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback
} from "react-native";
import { Styles, Sizes, Colours } from "localyyz/constants";

// third party
import { observer, inject } from "mobx-react";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";

// local
import BlockSliderButton from "./BlockSliderButton";

// constants
const VISIBLE_TIME = 5000;
const BLOCK_SLIDER_COLOR = Colours.Foreground;
const BLOCK_SLIDER_TRANSPARENT_COLOR = Colours.Transparent;
const VIEWABLITY_CONFIG = {
  viewAreaCoveragePercentThreshold: 40
};

@inject(stores => ({
  blocks: stores.homeStore.trackedBlocks,
  currentBlock: stores.homeStore.currentTrackedBlock,
  currentTrackedBlock: stores.homeStore.currentTrackedBlock,
  trackedBlocks: stores.homeStore.trackedBlocks
}))
@observer
export default class BlockSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };

    // bindings
    this.getNextNthBlock = this.getNextNthBlock.bind(this);
    this.slideTo = this.slideTo.bind(this);
    this.slideFail = this.slideFail.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  renderItem = ({ item, index: i }) => (
    <BlockSliderButton id={i} block={item} />
  );

  slideTo(index) {
    this.refs.slider
      && this.refs.slider.scrollToIndex({
        index: index,
        viewPosition: 0.5
      });
  }

  slideFail({ index, highestMeasuredFrameIndex }) {
    if (index > highestMeasuredFrameIndex) {
      this.slideTo(highestMeasuredFrameIndex);
    } else if (index < 0) {
      this.slideTo(0);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.currentBlock !== nextProps.currentBlock
      || (this.state.isVisible !== nextState.isVisible && !nextState.isVisible)
    );
  }

  componentDidUpdate() {
    !this.state.isVisible && this.show();
    this.slideTo(this.props.currentBlock || 0);
  }

  componentWillUnmount() {
    this._timer && clearTimeout(this._timer);
  }

  show() {
    this.setState({ isVisible: true });
  }

  hide() {
    this.setState({ isVisible: false });
  }

  get nextActualBlock() {
    return this.getNextNthBlock(1);
  }

  get prevActualBlock() {
    return this.getNextNthBlock(-1);
  }

  getNextNthBlock(n) {
    let blocks = this.props.trackedBlocks;
    let nextBlockIndex = this.props.currentTrackedBlock + n;

    // end block or start block
    if (nextBlockIndex >= blocks.length || nextBlockIndex < 0) {
      nextBlockIndex = nextBlockIndex - n;
    }

    // translate to real block id
    return blocks[nextBlockIndex].actualId;
  }

  render() {
    this.componentWillUnmount();
    this._timer = setTimeout(this.hide, VISIBLE_TIME);

    return (
      <Animatable.View
        animation={this.state.isVisible ? "slideInUp" : "slideOutDown"}
        duration={VISIBLE_TIME / 10}
        easing="ease-out">
        <View style={styles.container}>
          <FlatList
            ref="slider"
            horizontal
            showsHorizontalScrollIndicator={false}
            onScrollToIndexFailed={this.slideFail}
            contentContainerStyle={styles.contentContainer}
            data={this.props.blocks}
            keyExtractor={(e, i) => `blocksliderbutton-${i}`}
            renderItem={this.renderItem}
            pointerEvents="none"
            viewabilityConfig={VIEWABLITY_CONFIG}/>
          <View style={styles.overlays}>
            <View style={styles.overlayContainer}>
              <TouchableWithoutFeedback
                onPress={() => this.props.scrollTo(this.prevActualBlock)}>
                <View style={styles.leftEndcap}>
                  <LinearGradient
                    colors={[
                      BLOCK_SLIDER_COLOR,
                      BLOCK_SLIDER_COLOR,
                      BLOCK_SLIDER_TRANSPARENT_COLOR
                    ]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.endcaps}/>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => this.props.scrollTo(this.nextActualBlock)}>
                <View style={styles.rightEndcap}>
                  <LinearGradient
                    colors={[
                      BLOCK_SLIDER_COLOR,
                      BLOCK_SLIDER_COLOR,
                      BLOCK_SLIDER_TRANSPARENT_COLOR
                    ]}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.endcaps}/>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </Animatable.View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Sizes.Width / 2
  },

  container: {
    marginBottom: Sizes.InnerFrame * 0.7,
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: BLOCK_SLIDER_COLOR
  },

  overlays: {
    ...Styles.Horizontal,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },

  overlayContainer: {
    flex: 1,
    ...Styles.Horizontal
  },

  endcaps: {
    flex: 1,
    width: Sizes.OuterFrame * 3
  },

  leftEndcap: {
    flex: 1,
    alignItems: "flex-start"
  },

  rightEndcap: {
    flex: 1,
    alignItems: "flex-end"
  }
});
