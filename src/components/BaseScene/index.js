import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";

// third party
import LinearGradient from "react-native-linear-gradient";

// custom
import { Sizes, Styles, Colours } from "localyyz/constants";
import {
  ContentCoverSlider,
  ReactiveSpacer,
  ConstrainedAspectImage
} from "localyyz/components";

export default class BaseScene extends React.Component {
  constructor(props) {
    super(props);

    // stores
    this.contentCoverStore = ContentCoverSlider.createStore();

    // bindings
    this.onBack = this.onBack.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
  }

  onBack() {
    return this.props.backAction || false;
  }

  scrollTo(y) {
    return this.scrollRef && this.scrollRef.scrollTo(y);
  }

  get headerComponent() {
    return this.props.image ? ConstrainedAspectImage : View;
  }

  get header() {
    let image = this.props.image || {};
    return (
      <View
        onLayout={this.contentCoverStore.onLayout}
        style={!this.props.header && styles.header}>
        {!this.props.header ? (
          <this.headerComponent
            source={{ uri: image.imageUrl }}
            constrainWidth={Sizes.Width}
            sourceWidth={image.width}
            sourceHeight={image.height}>
            <View style={image.imageUrl && styles.builtInHeader}>
              <LinearGradient
                colors={[
                  image.imageUrl
                    ? this.props.backgroundColor || Colours.Foreground
                    : Colours.Transparent,
                  image.imageUrl
                    ? this.props.backgroundColor || Colours.Foreground
                    : Colours.Transparent,
                  image.imageUrl
                    ? this.props.transparentBackgroundColor
                      || Colours.Transparent
                    : Colours.Transparent
                ]}
                start={{ y: 1, x: 0 }}
                end={{ y: 0, x: 0 }}
                style={styles.gradient}>
                <Text
                  style={[
                    styles.title,
                    this.props.titleColor && { color: this.props.titleColor }
                  ]}>
                  {this.props.title}
                </Text>
                {this.props.description ? (
                  <Text
                    style={[
                      styles.description,
                      this.props.titleColor && { color: this.props.titleColor }
                    ]}>
                    {this.props.description}
                  </Text>
                ) : null}
              </LinearGradient>
            </View>
          </this.headerComponent>
        ) : (
          this.props.header
        )}
      </View>
    );
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
          backAction={this.onBack()}
          background={this.header}
          iconType={this.props.iconType}
          idleStatusBarStatus={this.props.idleStatusBarStatus}>
          <View style={styles.container}>
            <ScrollView
              ref="scroll"
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={evt => this.sliderRef && this.sliderRef.onScroll(evt)}>
              {this.spacer}
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

  title: {
    ...Styles.Text,
    ...Styles.Title
  },

  description: {
    ...Styles.Text,
    marginTop: Sizes.InnerFrame / 2
  },

  builtInHeader: {
    flex: 1,
    justifyContent: "flex-end"
  },

  gradient: {
    paddingTop: Sizes.OuterFrame * 3,
    paddingHorizontal: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  },

  content: { paddingBottom: Sizes.OuterFrame * 4 }
});
