import React from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StatusBar,
  ScrollView
} from "react-native";
import { Styles, Colours, Sizes, NAVBAR_HEIGHT } from "localyyz/constants";
import Filter from "../Filter";
import UppercasedText from "../UppercasedText";
import PropTypes from "prop-types";

// third party
import * as Animatable from "react-native-animatable";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { inject, observer } from "mobx-react/native";

export class FilterPopupButton extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func.isRequired
  };

  static defaultProps = {
    text: "Filter / Sort"
  };

  render() {
    return (
      <View style={styles.toggle} pointerEvents="box-none">
        <View style={styles.gradient} pointerEvents="box-none">
          <TouchableOpacity onPress={this.props.onPress}>
            <Animatable.View
              animation="fadeIn"
              duration={500}
              delay={1000}
              style={styles.toggleContainer}>
              <MaterialIcon
                name="sort"
                size={Sizes.TinyText}
                color={Colours.Text}/>
              <UppercasedText style={styles.toggleLabel}>
                {this.props.text}
              </UppercasedText>
            </Animatable.View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

@inject(stores => ({
  scrollEnabled: stores.filterStore.scrollEnabled,
  filterStore: stores.filterStore
}))
@observer
export default class FilterPopup extends React.Component {
  static propTypes = {
    filterStore: PropTypes.object.isRequired,
    minWhitespace: PropTypes.number,

    // if the parent view isn't the entire device height (minus navbar, include
    // the offset)
    screenOffset: PropTypes.number,
    isVisible: PropTypes.bool
  };

  static defaultProps = {
    minWhitespace: Sizes.Height / 3,
    screenOffset: 0,
    isVisible: false
  };

  static getNewStore(searchStore, initParams = {}) {
    return Filter.getNewStore(searchStore, initParams);
  }

  constructor(props) {
    super(props);
    this.state = {
      height: 0
    };

    // bindings
    this.toggle = this.toggle.bind(this);
    this.onLayout = this.onLayout.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.isVisible != null
      && prevState != null
      && nextProps.isVisible !== prevState.isVisible
      ? {
          isVisible: nextProps.isVisible
        }
      : null;
  }

  toggle(show) {
    show != this.state.isVisible
      && this.setState({
        isVisible: show != null ? show : !this.state.isVisible
      });
  }

  onLayout({ nativeEvent: { layout: { height } } }) {
    height > this.state.height
      && this.setState({
        height: height
      });
  }

  get dismissPadding() {
    return Math.min(
      Sizes.Height - NAVBAR_HEIGHT - this.props.screenOffset,
      Math.max(
        this.props.minWhitespace || Sizes.OuterFrame,
        Sizes.Height
          - NAVBAR_HEIGHT
          - this.props.screenOffset
          - this.state.height
      )
    );
  }

  render() {
    return (
      <View style={styles.cover} pointerEvents="box-none">
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: Sizes.ScreenBottom + Sizes.InnerFrame - 2
          }}>
          <FilterPopupButton onPress={() => this.toggle(true)} />
        </View>
        {this.state.isVisible ? (
          <Animatable.View
            animation="fadeIn"
            duration={500}
            style={styles.container}>
            <Animatable.View
              animation="fadeIn"
              duration={1}
              delay={1000}
              style={[
                styles.bottomSheetHack,
                {
                  height: this.state.height / 2
                }
              ]}/>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              scrollEnabled={this.props.scrollEnabled}>
              <StatusBar hidden />
              <TouchableWithoutFeedback onPress={() => this.toggle(false)}>
                <View style={[styles.cover, { height: this.dismissPadding }]} />
              </TouchableWithoutFeedback>
              <Animatable.View
                animation="fadeInUp"
                duration={300}
                delay={700}
                style={styles.content}
                onLayout={this.onLayout}>
                <TouchableOpacity onPress={() => this.toggle(false)}>
                  <View style={styles.dismissButton}>
                    <MaterialIcon
                      name="close"
                      size={Sizes.H2}
                      color={Colours.Text}/>
                  </View>
                </TouchableOpacity>
                <View style={styles.filter}>
                  <Filter />
                </View>
              </Animatable.View>
            </ScrollView>
          </Animatable.View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.DarkTransparent
  },

  cover: {
    flex: 1
  },

  content: {
    padding: Sizes.OuterFrame,
    backgroundColor: Colours.Foreground
  },

  toggle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },

  gradient: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: Sizes.Height / 6
  },

  toggleContainer: {
    ...Styles.Horizontal,
    margin: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame,
    backgroundColor: Colours.WhiteTransparent,
    shadowColor: Colours.DarkTransparent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.1,
    alignItems: "center",
    justifyContent: "center"
  },

  toggleLabel: {
    ...Styles.Text,
    ...Styles.Medium,
    marginLeft: Sizes.InnerFrame / 2
  },

  dismissButton: {
    marginBottom: Sizes.InnerFrame
  },

  filter: {
    marginLeft: 3
  },

  bottomSheetHack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colours.Foreground
  }
});
