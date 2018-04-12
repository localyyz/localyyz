import React from "react";
import { View, StyleSheet, Animated } from "react-native";

// custom
import { Sizes, Colours } from "localyyz/constants";
import { ApiInstance } from "localyyz/global";
import { Product } from "localyyz/models";
import { NavBar, ProductList } from "localyyz/components";
import SearchTags from "./SearchTags";

// third party
import { observer, inject } from "mobx-react";
import * as Animatable from "react-native-animatable";
import LinearGradient from "react-native-linear-gradient";

// consts

@inject(stores => ({
  searchResults: stores.homeStore.searchResults,
  assistantStore: stores.assistantStore
}))
@observer
export default class SearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assistantHeight: 0,
      processing: false,
      query: null,
      rawQuery: null,
      next: null,
      shouldShowTags: true
    };
    this._motion = new Animated.Value(0);
    this._previous = 0;
    this._change = 0;

    // stores
    this.assistant = this.props.assistantStore;

    // bindings
    this.search = this.search.bind(this);
    this.clear = this.clear.bind(this);
  }

  //get isActive() {
  //return this.state.results.length > 0 || this.state.processing;
  //}

  clear(cb) {
    this.setState(
      {
        results: [],
        processing: false,
        query: null,
        rawQuery: null,
        next: null
      },
      cb
    );
  }

  search(query, rawQuery) {
    // clear out search if searching for nothing
    if (!query) {
      this.setState({
        processing: false,
        results: []
      });
    } else if (!this.state.processing) {
      const rawQueryHasChanged = rawQuery !== this.state.rawQuery;
      const queryHasChanged = query !== this.state.query || rawQueryHasChanged;
      const shouldStartNewSearch = queryHasChanged || !this.state.next;

      !(!shouldStartNewSearch && this.state.next === -1)
        && this.setState(
          {
            processing: true,
            query: query,
            rawQuery: rawQuery
          },
          () =>
            ApiInstance.post(
              "search",
              {
                query: query
              },
              {
                limit: PAGE_LIMIT,
                ...(!shouldStartNewSearch
                  ? {
                      page: this.state.next
                    }
                  : {})
              }
            )
              .then(response => {
                if (response && response.status < 400 && response.data) {
                  this.setState(
                    {
                      results: [
                        ...(!shouldStartNewSearch ? this.state.results : []),
                        ...response.data.map(product => new Product(product))
                      ],
                      processing: false,
                      next:
                        (response.link
                          && response.link.next
                          && response.link.next.page)
                        || -1,

                      // new search clears tags
                      ...(rawQueryHasChanged ? { tags: [] } : {})
                    },
                    () => {
                      if (shouldStartNewSearch && response.data.length < 1) {
                        this.assistant.write(
                          `Sorry! I couldn't find any product for "${query}"`,
                          5000
                        );
                      }
                    }
                  );
                }
              })
              .catch(console.log)
        );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.props.searchResults
        || this.props.searchResults.current() === undefined ? (
          <View />
        ) : (
          <Animatable.View animation="fadeIn" style={styles.results}>
            <ProductList
              style={{
                paddingBottom: this.state.tagsHeight
              }}
              products={this.props.searchResults.current()}/>
          </Animatable.View>
        )}
        {/*
        <View
          pointerEvents={this.state.shouldShowTags ? "auto" : "none"}
          style={styles.filters}
          onLayout={e =>
            //this.setState({
              //tagsHeight: e.nativeEvent.layout.height
            //})
          }>
          <Animatable.View
            animation={this.state.shouldShowTags ? "fadeInUp" : "fadeOutDown"}
            duration={300}
            delay={500}>
            <LinearGradient
              colors={[Colours.Foreground, Colours.Transparent]}
              start={{ y: 1 }}
              end={{ y: 0 }}
              style={styles.recommendedTags}>
              <SearchTags
                query={this.props.query}
                onFlush={tags =>
                  this.props.updateSearchQuery(
                    _combineQueryWithTags(this.props.query, tags)
                  )
                }
                onChange={tags => {
                  this.setState(
                    {
                      tags: tags
                    },
                    () =>
                      this.search(_combineQueryWithTags(this.props.query, tags))
                  );
                }}/>
            </LinearGradient>
          </Animatable.View>
        </View>
        */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  results: {
    flex: 1,
    marginBottom: NavBar.HEIGHT,
    backgroundColor: Colours.Foreground
  },

  recommendedTags: {
    paddingVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.OuterFrame
  },

  filters: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: NavBar.HEIGHT
  }
});

function _combineQueryWithTags(query, tags) {
  if (!tags) {
    return query;
  } else {
    let tagLabels = tags.length > 0 ? tags.map(tag => tag.label).join(" ") : "";
    let combinedQuery
      = (query || "") + (!!query && !!tagLabels ? " " : "") + tagLabels;
    return combinedQuery;
  }
}
