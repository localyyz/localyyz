import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

// custom
import { Sizes, Colours, NAVBAR_HEIGHT } from "localyyz/constants";
import { ContentCoverSlider, ReactiveSpacer } from "localyyz/components";

export default class BaseScene extends React.Component {
  constructor(props) {
    super(props);

    // stores
    this.contentCoverStore = ContentCoverSlider.createStore();

    // bindings
    this.onBack = this.onBack.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  onBack() {
    return this.props.backAction || false;
  }

  scrollTo(y) {
    return this.scrollRef && this.scrollRef.scrollTo(y);
  }

  get spacer() {
    return (
      <ReactiveSpacer
        store={this.contentCoverStore}
        heightProp="headerHeight"/>
    );
  }

  get scrollRef() {
    return this.refs.scroll;
  }

  get sliderRef() {
    return this.refs.slider;
  }

  onScroll(evt) {
    return this.sliderRef && this.sliderRef.onScroll(evt);
  }

  get header() {
    return (
      <View onLayout={this.contentCoverStore.onLayout}>
        {this.props.header || <ContentCoverSlider.Header {...this.props} />}
      </View>
    );
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.backgroundColor && {
            backgroundColor: this.props.backgroundColor
          }
        ]}>
        <ContentCoverSlider
          ref="slider"
          title={this.props.title}
          backColor={this.props.backColor || Colours.Text}
          backAction={() => this.props.backAction && this.props.backAction()}
          background={this.header}
          iconType={this.props.iconType}
          idleStatusBarStatus={this.props.idleStatusBarStatus}>
          <View style={styles.container}>
            <ScrollView
              ref="scroll"
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={this.onScroll}>
              {this.spacer}
              <View style={[styles.content, this.props.style]}>
                {this.props.children}
              </View>
            </ScrollView>
          </View>
        </ContentCoverSlider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: {
    paddingBottom: NAVBAR_HEIGHT + Sizes.InnerFrame,
    minHeight: Sizes.Height
  }
});
