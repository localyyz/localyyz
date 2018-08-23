import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList
} from "react-native";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";
import { ContentCoverSlider, ReactiveSpacer } from "localyyz/components";
import { capitalize } from "localyyz/helpers";
import { GA } from "localyyz/global";

// third party
import { computed } from "mobx";
import { Provider, inject, observer } from "mobx-react/native";

// constants
const SHOW_ALL_LABEL = "Show all";

export default class FilterList extends React.Component {
  constructor(props) {
    super(props);

    // data
    this.ccs = ContentCoverSlider.createStore();

    // bindings
    this.close = this.close.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    this.settings.asyncFetch && this.settings.asyncFetch();
  }

  close() {
    return this.props.navigation.goBack(null);
  }

  onScroll(evt) {
    return this.sliderRef && this.sliderRef.onScroll(evt);
  }

  get sliderRef() {
    return this.refs.slider;
  }

  get title() {
    return this.settings.title;
  }

  get header() {
    return (
      <View onLayout={this.ccs.onLayout}>
        <ContentCoverSlider.Header title={this.title} />
      </View>
    );
  }

  get settings() {
    return (
      (this.props.navigation
        && this.props.navigation.state
        && this.props.navigation.state.params)
      || this.props
    );
  }

  render() {
    return (
      <Provider
        contentCoverStore={this.ccs}
        filterStore={this.settings.filterStore}>
        <ContentCoverSlider
          ref="slider"
          title={capitalize(this.title)}
          background={this.header}
          backColor={Colours.Text}
          backAction={this.close}>
          <Options
            {...this.settings}
            navigation={this.props.navigation}
            data={this.settings.data || []}
            onScroll={this.onScroll}/>
        </ContentCoverSlider>
      </Provider>
    );
  }
}

@inject((stores, props) => ({
  ccs: stores.contentCoverStore,
  data: stores.filterStore[props.id] || []
}))
@observer
export class Options extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderSpacer = this.renderSpacer.bind(this);
    this.renderClear = this.renderClear.bind(this);
  }

  renderItem({ item: option }) {
    return (
      <Option
        {...this.props}
        navigation={this.props.navigation}
        option={option.label || option}
        onSelect={option.onSelect || (() => this.props.setFilter(option))}/>
    );
  }

  renderSectionHeader({ section: { title } }) {
    return title ? (
      <View style={styles.wrapper}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderLabel}>{title}</Text>
        </View>
      </View>
    ) : null;
  }

  renderSpacer() {
    return <ReactiveSpacer store={this.props.ccs} heightProp="headerHeight" />;
  }

  renderClear() {
    return this.renderItem({
      item: {
        label: SHOW_ALL_LABEL,
        onSelect: this.props.clearFilter
      }
    });
  }

  @computed
  get sections() {
    // build listing of keys and init their arrays
    let sections = Object.assign(
      {},
      ..."abcdefghijklmnopqrstuvwxyz"
        .toUpperCase()
        .split("")
        .map(letter => ({ [letter]: [] })),
      ..."0123456789".split("").map(num => ({ [num]: [] }))
    );

    // add options appropriately by first letter
    let data = this.props.data.slice();
    data.map(
      option =>
        option
        && option[0]
        && sections[option[0].toUpperCase()]
        && sections[option[0].toUpperCase()].push(option)
    );

    // and finally sort each subarray and out
    return [
      // spacer
      { data: [{}], renderItem: this.renderSpacer },

      // clear filter
      { data: [{}], renderItem: this.renderClear },

      // actual options
      ...Object.keys(sections)
        .filter(section => sections[section].length > 0)
        .map(section => ({ title: section, data: sections[section].sort() }))
    ];
  }

  render() {
    return (
      <SectionList
        {...this.props}
        sections={this.sections}
        keyExtractor={(e, i) => `filter-list-${e}-${i}`}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        ListFooterComponent={<View style={styles.footer} />}
        contentContainerStyle={styles.container}/>
    );
  }
}

class Option extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect() {
    this.props.title == "Brand"
      && GA.trackEvent(
        "filter/sort",
        "filter by " + this.props.title,
        this.props.option
      );
    this.props.onSelect && this.props.onSelect();
    return this.props.navigation.goBack(null);
  }

  render() {
    return this.props.option === SHOW_ALL_LABEL ? (
      <View style={[styles.wrapper, styles.topWrapper]}>
        <TouchableOpacity onPress={this.onSelect}>
          <View style={styles.topOption}>
            <Text style={styles.topOptionLabel}>
              {capitalize(this.props.option)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={[styles.wrapper]}>
        <TouchableOpacity onPress={this.onSelect}>
          <View style={styles.option}>
            <Text style={styles.optionLabel}>
              {capitalize(this.props.option)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: NAVBAR_HEIGHT
  },

  option: {
    paddingVertical: Sizes.InnerFrame / 2,
    borderBottomWidth: Sizes.Hairline,
    borderColor: Colours.Border,
    marginHorizontal: Sizes.InnerFrame
  },

  optionLabel: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  sectionHeader: {
    paddingVertical: Sizes.InnerFrame / 2,
    marginBottom: Sizes.InnerFrame,
    borderBottomWidth: Sizes.Spacer,
    borderBottomColor: Colours.SubduedText
  },

  sectionHeaderLabel: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  wrapper: {
    paddingLeft: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 4,
    backgroundColor: Colours.Foreground
  },

  topOption: {
    borderWidth: 1,
    marginRight: Sizes.InnerFrame,
    height: Sizes.InnerFrame * 3,
    justifyContent: "center"
  },

  topWrapper: {
    paddingTop: Sizes.InnerFrame,
    justifyContent: "center"
  },

  topOptionLabel: {
    ...Styles.Emphasized,
    textAlign: "center"
  },

  footer: {
    padding: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  }
});
