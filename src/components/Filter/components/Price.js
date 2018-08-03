import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes, Colours } from "localyyz/constants";
import { toPriceString } from "localyyz/helpers";
import { GA } from "localyyz/global";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react/native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as Animatable from "react-native-animatable";

// local
import SliderMarker from "./SliderMarker";

// constants
const STEP_SIZE = 0.05;
const SLIDER_PERCENTAGE_OF_PARENT_WIDTH = 0.8;

@inject(stores => ({
  priceMin: stores.filterStore.priceMin,
  priceMax: stores.filterStore.priceMax,
  setPriceFilter: stores.filterStore.setPriceFilter,
  setScrollEnabled: stores.filterStore.setScrollEnabled,
  refresh: stores.filterStore.refresh
}))
@observer
export default class Price extends React.Component {
  static SLIDER_PERCENTAGE_OF_PARENT_WIDTH = SLIDER_PERCENTAGE_OF_PARENT_WIDTH;
  static STEP_SIZE = STEP_SIZE;

  static propTypes = {
    // upper and lower limits of the slider
    min: PropTypes.number,
    max: PropTypes.number,

    // mobx injected, actual selected range values
    priceMin: PropTypes.number,
    priceMax: PropTypes.number,
    setPriceFilter: PropTypes.func.isRequired,
    setScrollEnabled: PropTypes.func.isRequired
  };

  static defaultProps = {
    min: 0,
    max: 300
  };

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      width: 0,
      isAtMax: this.props.priceMax
        ? this.props.priceMax === Price.defaultProps.max
        : true
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
      && this.setState(
        {
          isActive: active != null ? active : !this.state.isActive
        }
        // TODO: this rerenders the whole scrollview on FilterPopup.
        //() => this.props.setScrollEnabled(!this.state.isActive)
      );
  }

  onValuesChangeStart() {
    this.activate(true);
  }

  onValuesChangeFinish(values) {
    GA.trackEvent(
      "filter/sort",
      "sort by price",
      values[0].toString() + "-" + values[1].toString()
    );
    this.props.setPriceFilter(this.bound(values[0]), this.bound(values[1]));
    this.setState({
      //if the end value is equal to the max
      isAtMax: values[1] === this.props.max
    });
    this.activate(false);
  }

  get stepSize() {
    return Math.round((this.props.max - this.props.min) * STEP_SIZE);
  }

  get priceMin() {
    return this.props.priceMin != null ? this.props.priceMin : this.props.min;
  }

  get priceMax() {
    return this.props.priceMax != null ? this.props.priceMax : this.props.max;
  }

  bound(price) {
    return Math.max(this.props.min, Math.min(this.props.max, price));
  }

  onLayout(evt) {
    this.setState({
      width: evt.nativeEvent.layout.width
    });
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <Text style={styles.filterHeader}>By price</Text>
        <View style={styles.labelsAnimation}>
          <Animatable.View
            animation={this.state.isActive ? "fadeOut" : "slideInUp"}
            duration={300}
            style={styles.labels}>
            <Text style={styles.label}>
              {this.priceMin ? `$${this.priceMin.toFixed(2)}` : "Free"}
            </Text>
            <Text style={styles.label}>
              {`${toPriceString(this.priceMax)}${
                this.state.isAtMax ? "+" : ""
              }`}
            </Text>
          </Animatable.View>
        </View>
        <MultiSlider
          ref="slider"
          min={this.props.min}
          max={this.props.max}
          sliderLength={this.state.width * SLIDER_PERCENTAGE_OF_PARENT_WIDTH}
          step={this.stepSize}
          customMarker={evt => (
            <SliderMarker
              {...evt}
              currentValue={this.bound(evt.currentValue)}/>
          )}
          markerContainerStyle={styles.markerContainer}
          trackStyle={styles.track}
          markerOffsetX={-13}
          markerOffsetY={-5.5}
          unselectedStyle={styles.sliderUnselected}
          selectedStyle={styles.sliderSelected}
          values={[this.priceMin, this.priceMax]}
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

  filterHeader: {
    ...Styles.Text,
    ...Styles.Emphasized,
    marginBottom: Sizes.InnerFrame
  },

  labels: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  label: {
    ...Styles.Text
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
