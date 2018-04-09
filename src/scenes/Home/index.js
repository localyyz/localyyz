import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  Image,
  Animated,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";
import { ProductTile, StaggeredList, Assistant } from "localyyz/components";
import { facebook } from "localyyz/effects";
import { navLogo } from "localyyz/assets";
import Store from "./store";
import Search from "./components/Search";

// third party
import { observer, inject } from "mobx-react";
import * as Animatable from "react-native-animatable";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { BlurView } from "react-native-blur";

@inject("loginStore", "userStore")
@observer
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.store = new Store(props.loginStore);
    this.state = {
      headerHeight: 0,
      headerAssistantHeight: 1,
      headerWelcomeHeight: 0,
      searchActive: false,
      searchFocused: false,
      searchQuery: null
    };
    this.previous = 0;
    this._motion = new Animated.Value(0);
    this._position = new Animated.Value(0);
    this._originalPosition = 0;

    // bindings
    this.toggleSearch = this.toggleSearch.bind(this);
    this.cancelAutoSearch = this.cancelAutoSearch.bind(this);
    this.search = this.search.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.updateSearchQuery = this.updateSearchQuery.bind(this);
  }

  componentWillUnmount() {
    this.cancelAutoSearch();
  }

  cancelAutoSearch() {
    this._autoSearch && clearTimeout(this._autoSearch);
    this._autoSearch = null;
  }

  updateSearchQuery(query, performSearch, isFocused) {
    this.setState(
      {
        searchQuery: query
      },
      () => performSearch && this.search(query, isFocused)
    );
  }

  clearSearch() {
    this.setState({ searchQuery: null }, () => {
      if (this.searchResults) {
        this.searchResults.clear();
      }
      this.toggleSearch(false, false);
    });
  }

  search(query, isFocused) {
    this.searchResults &&
      this.searchResults.clear(() => this.searchResults.search(query));
    this.toggleSearch(true, !!isFocused);

    // log facebook event
    facebook.logEvent("fb_mobile_search", {
      fb_search_string: query
    });
  }

  get featuredProducts() {
    return this.store.featuredProducts || [];
  }

  get discountedProducts() {
    return this.store.discountedProducts || [];
  }

  get headerContentHeight() {
    return (
      this.state.headerAssistantHeight +
      this.state.headerWelcomeHeight +
      Sizes.OuterFrame
    );
  }

  toggleSearch(forceShow, isFocused) {
    this.setState(
      {
        searchActive: forceShow != null ? forceShow : !this.state.searchActive,
        searchFocused: isFocused
      },
      () => {
        this._position.setValue(
          this.state.searchActive ? Sizes.Height * 2 : this.state.previous
        );

        // and finally, defocus input box
        !isFocused && this.refs.searchInput.blur();
      }
    );
  }

  get searchResults() {
    return this.refs.searchResults && this.refs.searchResults.wrappedInstance;
  }

  get searchInput() {
    return this.refs.searchInput;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { navigation: { state } } = nextProps;
    if (state.params && state.params.reset) {
      // this resets the search + search results
      this.clearSearch();
    }
  }

  render() {
    StatusBar.setBarStyle("light-content", true);

    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={e => {
              let change = e.nativeEvent.contentOffset.y - this.previous;
              this.previous = e.nativeEvent.contentOffset.y;
              this._motion.setValue(change);
              this._position.setValue(this.previous);
            }}
            onMomentumScrollEnd={() => this._motion.setValue(0)}
            style={styles.content}
          >
            <View style={{ paddingTop: this.state.headerHeight }}>
              <View style={styles.listHeader}>
                <Text style={styles.sectionHeader}>{"Today's Finds"}</Text>
                <Text style={styles.sectionHeaderDescription}>
                  {
                    "Hand selected daily just for you by our team of fashionistas based on what you've viewed before"
                  }
                </Text>
              </View>
              <View style={styles.listWrapper}>
                <StaggeredList style={styles.splitList} offset={0}>
                  {this.featuredProducts.map(product => (
                    <ProductTile
                      key={`productTile-${product.id}`}
                      onPress={() =>
                        this.props.navigation.navigate("Product", {
                          product: product
                        })
                      }
                      product={product}
                    />
                  ))}
                </StaggeredList>
              </View>
              <View style={styles.listHeader}>
                <Text style={styles.sectionHeader}>
                  {"Limited time offers"}
                </Text>
                <Text style={styles.sectionHeaderDescription}>
                  {
                    "Watch this space for the hottest promotions and sales posted the minute they're live on Localyyz"
                  }
                </Text>
              </View>
              <StaggeredList offset={0} style={styles.splitList}>
                {this.discountedProducts.map(product => (
                  <ProductTile
                    key={`productTile-${product.id}`}
                    backgroundColor={Colours.Background}
                    onPress={() =>
                      this.props.navigation.navigate("Product", {
                        product: product
                      })
                    }
                    product={product}
                    motion={this._motion}
                  />
                ))}
              </StaggeredList>
            </View>
          </ScrollView>
        </View>
        {(this.state.searchActive ||
          (this.searchResults && this.searchResults.isActive)) && (
          <Animatable.View
            animation="fadeIn"
            duration={300}
            style={[
              styles.searchOverlay,
              {
                paddingTop: this.state.headerHeight
              }
            ]}
          >
            <TouchableWithoutFeedback
              onPress={() =>
                !this.searchResults ||
                (!this.searchResults.isActive &&
                  this.toggleSearch(false, false))
              }
            >
              <BlurView
                style={styles.searchOverlayBlur}
                blurType="light"
                blurAmount={10}
              >
                <Search
                  navigation={this.props.navigation}
                  onQueryChange={this.updateSearchQuery}
                  searchFocused={this.state.searchFocused}
                  ref="searchResults"
                  query={this.state.searchQuery}
                />
              </BlurView>
            </TouchableWithoutFeedback>
          </Animatable.View>
        )}
        <View
          style={styles.header}
          onLayout={e =>
            this.setState({ headerHeight: e.nativeEvent.layout.height })
          }
        >
          <Animated.View
            style={[
              styles.headerContent,
              {
                height: this._position.interpolate({
                  inputRange: [0, this.headerContentHeight + 200],
                  outputRange: [this.headerContentHeight, 0],
                  extrapolate: "clamp"
                })
              }
            ]}
          >
            <Animated.View
              style={{
                opacity: this._position.interpolate({
                  inputRange: [
                    this.headerContentHeight + 50,
                    this.headerContentHeight + 150
                  ],
                  outputRange: [1, 0],
                  extrapolate: "clamp"
                })
              }}
            >
              <View
                style={styles.splitWelcome}
                onLayout={e =>
                  this.state.headerWelcomeHeight ||
                  this.setState({
                    headerWelcomeHeight: e.nativeEvent.layout.height
                  })
                }
              >
                <Image style={styles.logo} source={navLogo} />
                <View
                  style={[
                    styles.avatarOutline,
                    !this.props.userStore.avatarUrl && {
                      backgroundColor: Colours.Transparent
                    }
                  ]}
                >
                  {!!this.props.userStore.avatarUrl && (
                    <Image
                      style={styles.avatar}
                      source={{
                        uri: this.props.userStore.avatarUrl
                      }}
                    />
                  )}
                </View>
              </View>
            </Animated.View>
            <Assistant
              animator={this._position}
              messages={[
                `Welcome back${
                  this.props.userStore.name &&
                  this.props.userStore.name.length > 0
                    ? `, ${this.props.userStore.name.split(" ")[0]}`
                    : ""
                }!`,
                "I'm here to help you find something cool today ✨"
              ]}
              onLoad={e =>
                this.setState({
                  headerAssistantHeight: e.nativeEvent.layout.height
                })
              }
            />
          </Animated.View>
          <TouchableOpacity
            onPress={() =>
              this.refs.searchInput && this.refs.searchInput.focus()
            }
            style={styles.searchContainer}
            onLayout={e =>
              this.state.headerSearchHeight ||
              this.setState({
                headerSearchHeight: e.nativeEvent.layout.height
              })
            }
          >
            <Text style={styles.searchLabel}>
              {this.state.searchActive && !this.state.searchFocused
                ? "Showing search results for"
                : "Find"}
            </Text>
            <TextInput
              ref="searchInput"
              placeholder="something"
              returnKeyType="search"
              autoCorrect={false}
              placeholderTextColor={Colours.AlternateText}
              value={this.state.searchQuery}
              onChangeText={query =>
                this.setState(
                  {
                    searchQuery: query
                  },
                  () => {
                    this.cancelAutoSearch();
                    this._autoSearch = setTimeout(
                      () => this.search(query, true),
                      1000
                    );
                  }
                )
              }
              onEndEditing={() => {
                this.cancelAutoSearch();
                this.search(this.state.searchQuery);
              }}
              onFocus={() => this.toggleSearch(true, true)}
              onBlur={() =>
                this.toggleSearch(
                  !!this.searchResults && this.searchResults.isActive,
                  false
                )
              }
              style={styles.search}
            />
            <TouchableOpacity
              onPress={() => this.state.searchActive && this.clearSearch()}
              hitSlop={{
                top: Sizes.InnerFrame,
                bottom: Sizes.InnerFrame,
                left: Sizes.InnerFrame,
                right: Sizes.InnerFrame
              }}
            >
              <EntypoIcon
                name={
                  this.state.searchActive
                    ? "circle-with-cross"
                    : "magnifying-glass"
                }
                size={Sizes.Text}
                color={Colours.AlternateText}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: NAVBAR_HEIGHT
  },

  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: Sizes.OuterFrame,
    paddingTop: Sizes.OuterFrame * 2,
    backgroundColor: Colours.MenuBackground
  },

  headerContent: {
    overflow: "hidden"
  },

  splitWelcome: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    marginBottom: Sizes.InnerFrame * 8 / 10
  },

  avatarOutline: {
    alignItems: "center",
    justifyContent: "center",
    height: Sizes.Avatar,
    width: Sizes.Avatar,
    borderRadius: Sizes.Avatar / 2,
    backgroundColor: Colours.Foreground
  },

  avatar: {
    height: Sizes.Avatar * 0.9,
    width: Sizes.Avatar * 0.9,
    borderRadius: Sizes.Avatar * 0.9 / 2
  },

  logo: {
    tintColor: Colours.Foreground,
    height: 13,
    width: 90
  },

  searchContainer: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    paddingVertical: Sizes.InnerFrame / 2,
    borderBottomWidth: 0.5,
    borderBottomColor: Colours.AlternateText,
    backgroundColor: Colours.Transparent
  },

  searchLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Alternate,
    marginRight: Sizes.InnerFrame / 4
  },

  search: {
    ...Styles.Text,
    ...Styles.SmallText,
    ...Styles.Alternate,
    flex: 1
  },

  contentContainer: {
    flex: 1
  },

  content: {
    flex: 1,
    backgroundColor: Colours.Background
  },

  listHeader: {
    marginVertical: Sizes.OuterFrame,
    paddingTop: Sizes.OuterFrame
  },

  sectionHeader: {
    ...Styles.Text,
    ...Styles.SectionTitle
  },

  sectionHeaderDescription: {
    ...Styles.Text,
    ...Styles.SectionSubtitle
  },

  splitList: {
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2
  },

  searchOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },

  searchOverlayBlur: {
    flex: 1
  },

  listWrapper: {
    marginVertical: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  }
});
