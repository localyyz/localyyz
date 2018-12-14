import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList,
  ActivityIndicator
} from "react-native";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";
import { capitalize } from "localyyz/helpers";

// third party
import PropTypes from "prop-types";
import cloneDeep from "lodash.clonedeep";
import EntypoIcon from "react-native-vector-icons/Entypo";

// constants
const SHOW_ALL_LABEL = "Show all";

const ALPHANUM_SECTIONS = Object.assign(
  {},
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => ({ [letter]: [] })),
  ..."0123456789".split("").map(num => ({ [num]: [] }))
);

export default class FilterList extends React.Component {
  static navigationOptions = ({ navigation, navigationOptions }) => ({
    ...navigationOptions,
    header: undefined,
    title: capitalize(navigation.getParam("title", ""))
  });

  constructor(props) {
    super(props);

    this.state = {
      _data: [],
      sections: [],
      selected: (this.settings.filterStore[this.settings.id] || []).reduce(
        // reduce array to object for quick lookup
        (res, itm) => {
          res[itm] = true;
          return res;
        },
        {}
      )
    };
  }

  get settings() {
    return (
      (this.props.navigation
        && this.props.navigation.state
        && this.props.navigation.state.params)
      || this.props
    );
  }

  componentDidMount() {
    // here we Async fetch the filter list
    this.setState({ isLoading: true, sections: [] });
    this.settings.asyncFetch().then(response => {
      // start with empty alphabet list object
      let sections = cloneDeep(ALPHANUM_SECTIONS);

      // add options appropriately by first letter
      (response.data || []).map(
        option =>
          option
          && option[0]
          && sections[option[0].toUpperCase()]
          && sections[option[0].toUpperCase()].push(option)
      );

      // filter and transform sections
      sections = Object.keys(sections)
        .filter(section => sections[section].length > 0)
        .map(section => ({
          title: section,
          data: sections[section].sort()
        }));

      // check initial section length, append more if applicable
      let initialSections = [];
      let itemCount = 0;
      for (let idx in sections) {
        if (itemCount > 10) {
          break;
        }
        initialSections.push(sections[idx]);
        itemCount += sections[idx].data.length;
      }

      this.setState({
        isLoading: false,
        _data: sections,
        sectionIndex: initialSections.length,
        sections: initialSections
      });
    });
  }

  onSelectChange = (val, selected = true) => {
    selected
      ? (this.state.selected[val] = true)
      : delete this.state.selected[val];
    this.settings.setFilter(Object.keys(this.state.selected));
  };

  onClear = () => {
    this.settings.clearFilter();
    this.props.navigation.goBack();
  };

  renderItem = ({ item: option }) => {
    return (
      <Option
        selected={this.state.selected[option]}
        option={option.label || option}
        onSelect={this.onSelectChange}/>
    );
  };

  renderSectionHeader = ({ section: { title } }) => {
    return title ? (
      <View style={styles.wrapper}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderLabel}>{title}</Text>
        </View>
      </View>
    ) : null;
  };

  render() {
    return (
      <SectionList
        sections={this.state.sections}
        keyExtractor={(e, i) => `filter-list-${e}-${i}`}
        extraData={{
          isLoading: this.state.isLoading
        }}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        initialNumToRender={2}
        onEndReachedThreshold={0.8}
        onEndReached={({ distanceFromEnd }) => {
          const sectionIndex = this.state.sectionIndex + 2;
          if (
            distanceFromEnd > 0
            && !this.state.isLoading
            && this.state.sections.length != this.state._data.length
          ) {
            this.setState({
              sectionIndex: sectionIndex,
              sections: this.state._data.slice(0, sectionIndex)
            });
          }
        }}
        ListEmptyComponent={
          <View style={styles.footer}>
            <ActivityIndicator
              animating={this.state.isLoading}
              style={{ backgroundColor: Colours.Foreground }}
              size={"large"}/>
          </View>
        }
        ListHeaderComponent={
          <View style={[styles.wrapper, styles.topWrapper]}>
            <TouchableOpacity onPress={this.onClear}>
              <View style={styles.topOption}>
                <Text style={styles.topOptionLabel}>{SHOW_ALL_LABEL}</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {this.state.sections.length && (
              <ActivityIndicator
                animating={this.state.isLoading}
                style={{ backgroundColor: Colours.Foreground }}
                size={"large"}/>
            )}
          </View>
        }
        contentContainerStyle={styles.container}/>
    );
  }
}

class Option extends React.Component {
  static propTypes = {
    option: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected
    };
  }

  onSelect = () => {
    this.setState(
      {
        selected: !this.state.selected
      },
      () => {
        //this.state.selected
        //&& GA.trackEvent("filter/sort", "add filter", this.props.option);
        this.props.onSelect
          && this.props.onSelect(this.props.option, this.state.selected);
      }
    );
  };

  render() {
    return (
      <View style={[styles.wrapper]}>
        <TouchableOpacity onPress={this.onSelect}>
          <View style={styles.option}>
            <Text style={styles.optionLabel}>
              {capitalize(this.props.option)}
            </Text>
            {this.state.selected ? (
              <EntypoIcon
                name="check"
                size={18}
                color="black"
                style={{ paddingRight: 5 }}/>
            ) : null}
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Sizes.InnerFrame / 2,
    borderBottomWidth: Sizes.Hairline,
    borderColor: Colours.Border,
    marginHorizontal: Sizes.InnerFrame,
    height: Sizes.Button
  },

  optionLabel: {
    ...Styles.SmallText
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
    paddingVertical: Sizes.InnerFrame / 2,
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
