import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// third party
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import * as Animatable from "react-native-animatable";

// constants
const OUT_ANIMATION = "fadeOutUp";
const IN_ANIMATION = "fadeInUp";
const TRANSITION_DURATION = 100;
const DURATION = 2000;

@inject(stores => ({
  setNextSuggestion: () =>
    (stores.store.currentSuggestion
      = (stores.store.currentSuggestion + 1)
      % stores.store.searchSuggestions.length),
  currentSuggestion:
    stores.store.searchSuggestions[stores.store.currentSuggestion],
  searchSuggestions: stores.store.searchSuggestions,
  changeGenderSuggestions: stores.store.changeGenderSuggestions,
  searchQuery: stores.store.searchQuery,
  gender: stores.userStore.gender
}))
@observer
export default class SearchSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSuggestion: 0,
      animation: IN_ANIMATION
    };

    // bindings
    this.loadNextSuggestion = this.loadNextSuggestion.bind(this);
  }

  reactGender = reaction(
    () => this.props.gender,
    this.props.changeGenderSuggestions
  );

  loadNextSuggestion() {
    this.setState(
      {
        animation:
          this.state.animation === IN_ANIMATION ? OUT_ANIMATION : IN_ANIMATION
      },
      () => {
        if (this.state.animation === IN_ANIMATION) {
          this.props.setNextSuggestion();
        }
        this._timer = setTimeout(
          () => this.loadNextSuggestion(),
          this.state.animation === OUT_ANIMATION
            ? TRANSITION_DURATION
            : DURATION
        );
      }
    );
  }

  componentDidMount() {
    this.props.gender && this.props.changeGenderSuggestions(this.props.gender);
    this._timer = setTimeout(this.loadNextSuggestion, DURATION);
  }

  componentWillUnmount() {
    this._timer && clearTimeout(this._timer);
  }

  render() {
    return !this.props.searchQuery ? (
      <View style={styles.container}>
        <Animatable.View
          animation={this.state.animation}
          duration={TRANSITION_DURATION}>
          <Animated.Text
            style={[
              styles.suggestion,
              {
                //color: this.props.position.interpolate({
                //inputRange: [0, Sizes.Height / 5],
                //outputRange: [Colours.Text, Colours.AlternateText],
                //extrapolate: "clamp"
                //})
              }
            ]}>
            {this.props.currentSuggestion}
          </Animated.Text>
        </Animatable.View>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Sizes.InnerFrame * 3.5
  },

  suggestion: {
    ...Styles.Text,
    ...Styles.Emphasized
  }
});
