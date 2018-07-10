import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";

// custom
import { Sizes, Styles, Colours } from "localyyz/constants";
import { ContentCoverSlider, ReactiveSpacer } from "localyyz/components";

export default class BaseScene extends React.Component {
  constructor(props) {
    super(props);

    // stores
    this.contentCoverStore = ContentCoverSlider.createStore();

    // bindings
    this.renderHeader = this.renderHeader.bind(this);
    this.renderSpacer = this.renderSpacer.bind(this);
    this.onBack = this.onBack.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
  }

  renderHeader() {
    return (
      <View
        onLayout={this.contentCoverStore.onLayout}
        style={!this.props.header && styles.header}>
        {!this.props.header ? (
          <Text style={styles.title}>{this.props.title}</Text>
        ) : (
          this.props.header
        )}
      </View>
    );
  }

  renderSpacer() {
    return (
      <ReactiveSpacer
        store={this.contentCoverStore}
        heightProp="headerHeight"/>
    );
  }

  onBack() {
    return this.props.backAction || false;
  }

  scrollTo(y) {
    return this.scrollRef && this.scrollRef.scrollTo(y);
  }

  get scrollRef() {
    return this.refs.scroll;
  }

  get sliderRef() {
    return this.refs.slider;
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
          backColor={Colours.Text}
          backAction={this.onBack()}
          background={this.renderHeader()}
          iconType={this.props.iconType}
          idleStatusBarStatus={this.props.idleStatusBarStatus}>
          <View style={styles.container}>
            <ScrollView
              ref="scroll"
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={evt => this.sliderRef && this.sliderRef.onScroll(evt)}>
              {this.renderSpacer()}
              <View style={styles.content}>{this.props.children}</View>
            </ScrollView>
          </View>
        </ContentCoverSlider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: Sizes.OuterFrame,
    paddingVertical: Sizes.InnerFrame,
    paddingTop: Sizes.OuterFrame * 3
  },

  title: {
    ...Styles.Text,
    ...Styles.Title
  },

  content: { paddingBottom: Sizes.OuterFrame * 4 }
});
