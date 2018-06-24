import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes, Colours } from "localyyz/constants";

// third party
import { inject, observer } from "mobx-react/native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as Animatable from "react-native-animatable";
import PropTypes from "prop-types";

// local
import SliderMarker from "./SliderMarker";

// constants
const STEP_SIZE = 0.1;
const SLIDER_PERCENTAGE_OF_PARENT_WIDTH = 0.8;

@inject(stores => ({
  discountMin: stores.filterStore.discountMin,
  setDiscountFilter: stores.filterStore.setDiscountFilter
}))
@observer
export default class Discount extends React.Component {
  static SLIDER_PERCENTAGE_OF_PARENT_WIDTH = SLIDER_PERCENTAGE_OF_PARENT_WIDTH;
  static STEP_SIZE = STEP_SIZE;

  static propTypes = {
    setDiscountFilter: PropTypes.func.isRequired,
    discountMin: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      width: 0
    };

    // bindings
    this.onValuesChangeStart = this.onValuesChangeStart.bind(this);
    this.onValuesChangeFinish = this.onValuesChangeFinish.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.activate = this.activate.bind(this);
    this.bound = this.bound.bind(this);
  }

  activate(active) {
    active != this.state.isActive
      && this.setState({
        isActive: active != null ? active : !this.state.isActive
      });
  }

  onValuesChangeStart() {
    this.activate(true);
  }

  onValuesChangeFinish(values) {
    this.props.setDiscountFilter(this.bound(values[0]));
    this.activate(false);
  }

  get stepSize() {
    return STEP_SIZE;
  }

  get discountMin() {
    return this.props.discountMin != null ? this.props.discountMin : 0;
  }

  bound(price) {
    return Math.max(0, Math.min(1, price));
  }

  onLayout(evt) {
    this.setState({
      width: evt.nativeEvent.layout.width
    });
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <View style={styles.labelsAnimation}>
          <Animatable.View
            animation={this.state.isActive ? "fadeOut" : "slideInUp"}
            duration={300}
            style={styles.labels}>
            <Text style={styles.label}>
              {this.discountMin
                ? `${(this.discountMin * 100).toFixed(0)}%`
                : "Regular price"}
            </Text>
          </Animatable.View>
        </View>
        <MultiSlider
          ref="slider"
          min={0}
          max={1}
          sliderLength={this.state.width * SLIDER_PERCENTAGE_OF_PARENT_WIDTH}
          step={this.stepSize}
          customMarker={evt => (
            <SliderMarker
              {...evt}
              type="discount"
              currentValue={this.bound(evt.currentValue)}/>
          )}
          markerContainerStyle={{
            width: Sizes.OuterFrame * 3,
            height: Sizes.OuterFrame * 2
          }}
          markerContainerStyle={styles.markerContainer}
          trackStyle={styles.track}
          markerOffsetX={-13}
          markerOffsetY={-7.5}
          unselectedStyle={styles.sliderSelected}
          selectedStyle={styles.sliderUnselected}
          values={[this.discountMin]}
          onValuesChangeStart={this.onValuesChangeStart}
          onValuesChangeFinish={this.onValuesChangeFinish}
          containerStyle={styles.slider}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 2
  },

  slider: {
    alignItems: "center",
    justifyContent: "center",
    height: null
  },

  labelsAnimation: {
    paddingBottom: Sizes.InnerFrame,
    overflow: "hidden"
  },

  labels: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  label: {
    ...Styles.Text,
    ...Styles.TinyText
  },

  sliderSelected: {
    backgroundColor: Colours.Selected,
    height: 1
  },

  sliderUnselected: {
    backgroundColor: Colours.Unselected,
    height: 1
  },

  // multi slider
  markerContainer: {
    width: Sizes.OuterFrame * 3,
    height: Sizes.OuterFrame * 2
  },

  track: { marginBottom: Sizes.OuterFrame }
});
