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
import { capitalize } from "localyyz/helpers";
import { GA } from "localyyz/global";

// third party
import { computed } from "mobx";
import { Provider, inject, observer } from "mobx-react/native";
import IonIcon from "react-native-vector-icons/Ionicons";

// constants
const SHOW_ALL_LABEL = "Show all";

export default class FilterList extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => ({
    ...navigationOptions,
    header: undefined,
    title: capitalize(navigation.getParam("title", ""))
  });

  componentDidMount() {
    // here we Async fetch the filter list
    this.settings.asyncFetch && this.settings.asyncFetch();
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
      <Provider filterStore={this.settings.filterStore}>
        <Options {...this.settings} data={this.settings.data || []} />
      </Provider>
    );
  }
}

@inject((stores, props) => ({
  filterStore: stores.filterStore,
  data:
    (stores.filterStore[props.id] && stores.filterStore[props.id].slice()) || []
}))
@observer
export class Options extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
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
    let data = this.props.data;
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
    GA.trackEvent(
      "filter/sort",
      "filter by " + this.props.title,
      this.props.option
    );
    this.props.onSelect && this.props.onSelect();
    return this.props.navigation.goBack(null);
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.selected !== this.props.selected;
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
            <View>
              {this.props.selected === this.props.option && (
                <IonIcon name="ios-checkmark" size={30} color="black" />
              )}
            </View>
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Sizes.InnerFrame / 2,
    borderBottomWidth: Sizes.Hairline,
    borderColor: Colours.Border,
    marginHorizontal: Sizes.InnerFrame
  },

  optionLabel: {
    ...Styles.Title,
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
