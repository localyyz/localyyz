import React from "react";
import {
  Animated,
  View,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";

// third party
import { inject } from "mobx-react";
import EntypoIcon from "react-native-vector-icons/Entypo";
import * as Animatable from "react-native-animatable";

// custom
import { Styles, Colours, Sizes } from "localyyz/constants";
import { SloppyView } from "localyyz/components";
import { navLogo } from "localyyz/assets";

// constants
const START_FADE_DISTANCE = 0;
const END_FADE_DISTANCE = Sizes.Height / 5;
const FADE_DISTANCE = [START_FADE_DISTANCE, END_FADE_DISTANCE];

// local
import SearchSuggestions from "./components/SearchSuggestions";
import SearchInputBox from "./components/SearchInputBox";

@inject(stores => ({
  // layout
  onLayout: e => (stores.homeStore.headerHeight = e.nativeEvent.layout.height),
  position: stores.homeStore.scrollAnimate,

  // search forms
  searchActive: stores.homeStore.searchActive,
  onActivateSearch: () => (stores.homeStore.searchActive = true),
  onSearchClear: () => {
    stores.homeStore.searchActive = false;
    stores.homeStore.searchQuery = "";
    stores.homeStore.searchResults = [];
  }
}))
export default class Header extends React.Component {
  constructor(props) {
    super(props);

    // refs
    this.inputRef = React.createRef();

    // bindings
    this.renderSearch = this.renderSearch.bind(this);
    this.renderIdle = this.renderIdle.bind(this);
    this.activateSearch = this.activateSearch.bind(this);
  }

  activateSearch() {
    !this.props.searchActive
      && this.inputRef.current
      && this.inputRef.current.focus();
    this.props.onActivateSearch();
  }

  renderSearch() {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.searchLabelContainer}>
          <Text style={styles.searchLabel}>Search</Text>
        </View>
        <View style={styles.inputContainer}>
          <SearchInputBox ref={this.inputRef} />
        </View>
        <SearchSuggestions />
        {this.props.searchActive ? (
          <View style={styles.clearSearchContainer}>
            <TouchableOpacity onPress={this.props.onSearchClear}>
              <SloppyView>
                <EntypoIcon
                  name="circle-with-cross"
                  size={Sizes.Text}
                  color={Colours.AlternateText}/>
              </SloppyView>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }

  renderIdle() {
    return (
      <View style={styles.idleContainer}>
        <View style={styles.searchLabelContainer}>
          <Text style={styles.searchLabel}>Search</Text>
        </View>
        <Animatable.View animation="fadeInDown" duration={800} delay={200}>
          <Animated.Image
            style={[
              styles.logo,
              {
                tintColor: this.props.position.interpolate({
                  inputRange: FADE_DISTANCE,
                  outputRange: [Colours.Text, Colours.AlternateText],
                  extrapolate: "clamp"
                })
              }
            ]}
            source={navLogo}/>
        </Animatable.View>
      </View>
    );
  }

  render() {
    return (
      <Animated.View
        onLayout={this.props.onLayout}
        style={[
          styles.container,
          {
            backgroundColor: this.props.position.interpolate({
              inputRange: FADE_DISTANCE,
              outputRange: [Colours.Transparent, Colours.MenuBackground],
              extrapolate: "clamp"
            })
          }
        ]}>
        <StatusBar barStyle="light-content" />
        <TouchableWithoutFeedback onPress={() => this.activateSearch()}>
          <Animated.View
            style={[
              styles.search,
              {
                backgroundColor: this.props.position.interpolate({
                  inputRange: FADE_DISTANCE,
                  outputRange: [Colours.WhiteTransparent, Colours.Highlight],
                  extrapolate: "clamp"
                })
              }
            ]}>
            {this.props.searchActive ? this.renderSearch() : this.renderIdle()}
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colours.MenuBackground
  },

  search: {
    margin: Sizes.InnerFrame,
    marginTop: Sizes.ScreenTop,
    height: Sizes.InnerFrame * 2.5,
    paddingHorizontal: Sizes.InnerFrame,
    borderRadius: Sizes.InnerFrame,
    overflow: "hidden"
  },

  idleContainer: {
    ...Styles.Horizontal,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  searchContainer: {
    flex: 1,
    justifyContent: "center"
  },

  inputContainer: {
    flex: 1,
    justifyContent: "center"
  },

  searchLabelContainer: {
    position: "absolute",
    left: Sizes.InnerFrame / 2,
    top: 2,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },

  searchLabel: {
    ...Styles.Text,
    ...Styles.Subdued,
    ...Styles.TinyText
  },

  logo: {
    height: 13,
    width: 90,
    tintColor: Colours.AlternateText
  },

  clearSearchContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});
