import React from "react";
import { View, StyleSheet, FlatList, Keyboard } from "react-native";

// third party
import { observable, action } from "mobx";
import { inject } from "mobx-react/native";
import PropTypes from "prop-types";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { ContentCoverSlider, ReactiveSpacer } from "localyyz/components";
import { randInt } from "localyyz/helpers";

// local
import CartBaseContent from "./CartBaseContent";
import Progress from "./Progress";
import Totals from "./Totals";

// constants
const FOOTER_HEIGHT = Sizes.Height / 3;

@inject(stores => ({
  scenes: stores.cartUiStore.scenes
}))
export default class CartBaseScene extends React.Component {
  static Content = CartBaseContent;

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    scenes: PropTypes.array,
    activeSceneId: PropTypes.string,
    backAction: PropTypes.func,
    footer: PropTypes.node,

    // provide if requiring tests to not use random seed
    keySeed: PropTypes.string
  };

  static defaultProps = {
    scenes: []
  };

  @observable footerHeight = 0;

  constructor(props) {
    super(props);

    // stores
    this._ccs = ContentCoverSlider.createStore();

    // pseudo-unique (law of large numbers) key seed
    this._keySeed = this.props.keySeed || randInt(10000000) + 1;

    // bindings
    this._onScroll = this._onScroll.bind(this);
    this.setFooterHeight = this.setFooterHeight.bind(this);
  }

  componentDidMount() {
    this._keyboardShowListener = Keyboard.addListener("keyboardDidShow", () =>
      this.setFooterHeight(FOOTER_HEIGHT)
    );
    this._keyboardHideListener = Keyboard.addListener("keyboardDidHide", () =>
      this.setFooterHeight(0)
    );
  }

  componentWillUnmount() {
    this._keyboardShowListener && this._keyboardShowListener.remove();
    this._keyboardHideListener && this._keyboardHideListener.remove();
  }

  @action
  setFooterHeight(height) {
    this.footerHeight = height;
  }

  get sliderRef() {
    return this.refs.slider;
  }

  get onBack() {
    return () => this.props.navigation.goBack(null);
  }

  get spacer() {
    return <ReactiveSpacer store={this._ccs} heightProp="headerHeight" />;
  }

  get footer() {
    return <ReactiveSpacer store={this} heightProp="footerHeight" />;
  }

  get header() {
    return (
      <View onLayout={this._ccs.onLayout}>
        <ContentCoverSlider.Header {...this.props} title={this.title} />
      </View>
    );
  }

  get progress() {
    return (
      <View style={styles.header}>
        <Progress
          navigation={this.props.navigation}
          scenes={this.props.scenes}
          activeSceneId={this.props.activeSceneId}/>
      </View>
    );
  }

  get title() {
    return "Checkout";
  }

  get data() {
    return [
      this.spacer,
      this.progress,
      ...React.Children.toArray(this.props.children)
    ];
  }

  renderItem({ item: component }) {
    return component;
  }

  render() {
    return (
      <View style={styles.container}>
        <ContentCoverSlider
          ref="slider"
          title={this.title}
          backColor={Colours.Text}
          backAction={this.props.backAction || this.onBack}
          iconType={this.props.iconType}
          background={this.header}>
          <View style={styles.container}>
            <FlatList
              showsVerticalScrollIndicator={false}
              scrollEnabled={this.props.scrollEnabled}
              scrollEventThrottle={16}
              onScroll={this._onScroll}
              data={this.data}
              renderItem={this.renderItem}
              ListFooterComponent={this.footer}
              keyExtractor={(_, i) => `item-${this._keySeed}-${i}`}/>
          </View>
        </ContentCoverSlider>
        {this.props.footer || (
          <View style={styles.footer}>
            <Totals />
          </View>
        )}
      </View>
    );
  }

  _onScroll(evt) {
    return this.sliderRef && this.sliderRef.onScroll(evt);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  header: {
    marginHorizontal: Sizes.InnerFrame
  },

  footer: {
    padding: Sizes.InnerFrame,
    paddingBottom: Sizes.ScreenBottom + Sizes.InnerFrame
  }
});
