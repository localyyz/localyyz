import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";

// custom
import { Sizes, Styles, Colours } from "localyyz/constants";
import { ContentCoverSlider, ReactiveSpacer } from "localyyz/components";

export default class BaseScene extends React.Component {
  constructor(props) {
    super(props);

    // refs
    this.sliderRef = React.createRef();

    // stores
    this.contentCoverStore = ContentCoverSlider.createStore();

    // bindings
    this.renderHeader = this.renderHeader.bind(this);
    this.renderSpacer = this.renderSpacer.bind(this);
    this.onBack = this.onBack.bind(this);
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
          ref={this.sliderRef}
          title={this.props.title}
          backColor={Colours.Text}
          backAction={this.onBack()}
          background={this.renderHeader()}
          idleStatusBarStatus={this.props.idleStatusBarStatus}>
          <View style={styles.container}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={evt =>
                this.sliderRef.current && this.sliderRef.current.onScroll(evt)
              }>
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
