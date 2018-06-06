import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes, Colours } from "localyyz/constants";

// third party
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as Animatable from "react-native-animatable";

// local
import SliderMarker from "./SliderMarker";

// constants
const STEP_SIZE = 0.15;
const SLIDER_PERCENTAGE_OF_PARENT_WIDTH = 0.8;

@inject(stores => ({
  priceMin: stores.filterStore.priceMin,
  priceMax: stores.filterStore.priceMax,
  setPriceFilter: stores.filterStore.setPriceFilter,
  setScrollEnabled: stores.filterStore.setScrollEnabled
}))
@observer
export default class Price extends React.Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number
  };

  static defaultProps = {
    min: 0,
    max: 500
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
      && this.setState(
        {
          isActive: active != null ? active : !this.state.isActive
        },
        () => this.props.setScrollEnabled(!this.state.isActive)
      );
  }

  onValuesChangeStart() {
    this.activate(true);
  }

  onValuesChangeFinish(values) {
    this.props.setPriceFilter(this.bound(values[0]), this.bound(values[1]));
    this.activate(false);
  }

  get stepSize() {
    return Math.round((this.props.max - this.props.min) * STEP_SIZE);
  }

  get priceMin() {
    return this.props.priceMin != null
      ? this.props.priceMin
      : this.props.min + this.stepSize;
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
        <View style={styles.labelsAnimation}>
          <Animatable.View
            animation={this.state.isActive ? "fadeOut" : "slideInUp"}
            duration={300}
            style={styles.labels}>
            <Text style={styles.label}>
              {this.priceMin ? `$${this.priceMin.toFixed(2)}` : "Free"}
            </Text>
            <Text style={styles.label}>{`$${this.priceMax.toFixed(2)}`}</Text>
          </Animatable.View>
        </View>
        <MultiSlider
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
          markerOffsetY={-7.5}
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
