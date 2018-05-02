import React from "react";
import { View, StyleSheet } from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { NavBar, SearchTag } from "localyyz/components";
import { ApiInstance } from "localyyz/global";

// third party
import EntypoIcon from "react-native-vector-icons/Entypo";
import LinearGradient from "react-native-linear-gradient";
import { observer, inject } from "mobx-react";
import * as Animatable from "react-native-animatable";

@inject(stores => ({
  searchTagsVisible: stores.homeStore.searchTagsVisible,
  query: stores.homeStore.searchQuery
}))
@observer
export class SearchTagsWrapper extends React.Component {
  render() {
    return (
      <View
        pointerEvents={this.props.searchTagsVisible ? "auto" : "none"}
        style={styles.filters}
        onLayout={e =>
          this.setState({
            tagsHeight: e.nativeEvent.layout.height
          })
        }>
        <Animatable.View
          animation={this.props.searchTagsVisible ? "fadeInUp" : "fadeOutDown"}
          duration={300}
          delay={500}>
          <LinearGradient
            colors={[Colours.Foreground, Colours.Transparent]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.recommendedTags}>
            <SearchTags
              query={this.props.query}
              onFlush={tags => {
                //this.props.updateSearchQuery(
                //_combineQueryWithTags(this.props.query, tags)
                //)
              }}
              onChange={tags => {
                //this.setState(
                //{
                //tags: tags
                //},
                //() =>
                //this.search(_combineQueryWithTags(this.props.query, tags))
                //);
              }}/>
          </LinearGradient>
        </Animatable.View>
      </View>
    );
  }
}

export default class SearchTags extends React.Component {
  constructor(props) {
    super(props);
    this._api = ApiInstance;
    this.state = {
      tags: {}
    };

    // bindings
    this.select = this.select.bind(this);
    this.flush = this.flush.bind(this);
    this.requestFetch = this.requestFetch.bind(this);

    // timers
    this._update = null;
  }

  UNSAFE_componentWillReceiveProps(next) {
    // query change, update tags
    if (next.query != this.props.query) {
      this.requestFetch(next.query);
    }
  }

  get used() {
    return (
      this.state.tags
      && Object.values(this.state.tags).filter(
        tag => !!tag.isActive && !tag.isFlushed
      )
    );
  }

  get excludedLabels() {
    return (
      this.state.tags
      && Object.values(this.state.tags)
        .filter(tag => tag.isFlushed)
        .map(tag => tag.label)
    );
  }

  get displayedLabels() {
    return (
      this.state.tags
      && Object.values(this.state.tags)
        .filter(tag => !tag.isFlushed)
        .map(tag => tag.label)
    );
  }

  requestFetch(query) {
    this._update && clearTimeout(this._update);
    this._update = setTimeout(
      () =>
        this.fetch({ query: query, replace: true }).then(
          () => (this._update = null)
        ),
      1000
    );
  }

  fetch = async ({ query, replace }) => {
    const response = await this._api.post("search/related", {
      query: query
      // filterTags: this.excludedLabels
    });

    if (response && response.status < 400 && response.data) {
      let tags = this.state.tags;

      // invalidate all previous non-selected tags (or everything if replacing)
      Object.values(tags)
        .filter(tag => !tag.isActive || replace)
        .map(tag => (tag.isFlushed = true));

      // merge and convert list of new tags
      tags = {
        ...this.state.tags,
        ...response.data
          .filter(
            // prevent overwritting currently selected tags (reacting to backend bug
            // of returning repeat tags to current search)
            tag => this.used.map(tag => tag.label).findIndex(e => e === tag) < 0
          )
          .reduce((a, b) => {
            a[`${b}`] = {
              label: `${b}`,
              type: "generic"
            };

            return a;
          }, {})
      };

      // and update state
      this.setState({
        tags: tags
      });
    }
  };

  select(tag, selected) {
    this.setState(
      {
        tags: {
          ...this.state.tags,
          [`${tag}`]: {
            ...this.state.tags[tag],
            isActive: selected != null ? selected : true
          }
        }
      },
      () => {
        let query
          = this.props.query
          + (!!this.props.query && this.used.length > 0 ? " " : "")
          + this.used.map(tag => tag.label).join(" ");

        // update with new tags
        this.fetch({ query: query });

        // send out to caller if requested callback
        this.props.onChange && this.props.onChange(this.used);
      }
    );
  }

  flush(cb) {
    const tags = this.used;

    // add isFlushed to each tag
    let flushedTags = this.state.tags;
    for (let tag of Object.values(flushedTags)) {
      tag.isFlushed = true;
    }

    this.setState(
      {
        tags: flushedTags
      },
      () => (this.props.onFlush && this.props.onFlush(tags)) || (cb && cb(tags))
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {Object.values(this.state.tags)
          .filter(tag => !tag.isFlushed)
          .map(tag => (
            <SearchTag
              delay={200}
              key={`searchTag-${tag.label}`}
              color={tag.isActive ? Colours.PositiveButton : null}
              onPress={() => this.select(tag.label, !tag.isActive)}>
              {tag.label}
            </SearchTag>
          ))}
        {this.displayedLabels.length > 0 && (
          <SearchTag
            delay={500}
            color={Colours.Success}
            onPress={() => this.flush()}>
            <EntypoIcon
              name="add-to-list"
              color={Colours.AlternateText}
              size={Sizes.SmallText}/>
          </SearchTag>
        )}
      </View>
    );
  }
}

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

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "center"
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
