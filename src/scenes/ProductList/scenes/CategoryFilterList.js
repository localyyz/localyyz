import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList
} from "react-native";

import { computed, get, keys } from "mobx";
import { observer } from "mobx-react/native";
import IonIcon from "react-native-vector-icons/Ionicons";

// third party
//import PropTypes from "prop-types";

// custom
import { capitalize } from "localyyz/helpers";
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";

class Item extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.item.selected !== this.props.item.selected;
  }

  render() {
    const { item, onSelect } = this.props;
    return (
      <View style={[styles.wrapper, styles.indent]}>
        <TouchableOpacity
          onPress={() =>
            onSelect({ category: item.parentKey, subcategory: item.key })
          }>
          <View style={styles.option}>
            <Text style={styles.optionLabel}>{capitalize(item.key)}</Text>
            <View>
              {item.selected && (
                <IonIcon name="ios-checkmark" size={30} color="black" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

class Header extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected;
  }

  render() {
    const { item, selected, onSelect } = this.props;
    return (
      <View style={[styles.wrapper]}>
        <TouchableOpacity onPress={() => onSelect({ category: item })}>
          <View style={styles.option}>
            <Text style={styles.optionLabel}>{capitalize(item)}</Text>
            <View>
              {selected && (
                <IonIcon name="ios-checkmark" size={30} color="black" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

@observer
class Content extends React.Component {
  @computed
  get categorySections() {
    const hasParentSelected = keys(this.props.store.categories).some(
      key => this.props.store.category === key
    );

    return keys(this.props.store.categories)
      .filter(key => !hasParentSelected || this.props.store.category === key)
      .map(key => {
        const children = get(this.props.store.categories, key);

        const hasChildSelected
          = hasParentSelected
          && children.some(e => this.props.store.subcategory === e);

        return {
          key: key,
          selected: this.props.store.category === key,
          data: children
            .slice()
            .filter(
              subkey =>
                !hasChildSelected || this.props.store.subcategory === subkey
            )
            .map(subkey => ({
              key: subkey,
              parentKey: key,
              selected: this.props.store.subcategory === subkey
            }))
        };
      });
  }

  onSelect = ({ category, subcategory }) => {
    this.props.store.setCategoryFilter(category);
    category && this.props.store.fetchSubcategories(category);
    if (subcategory && subcategory !== this.props.store.subcategory) {
      this.props.store.setSubcategoryFilter(subcategory);
    }
  };

  renderItem = ({ item }) => {
    return <Item item={item} onSelect={this.onSelect} />;
  };

  renderSectionHeader = ({ section: { key, selected } }) => {
    return <Header item={key} selected={selected} onSelect={this.onSelect} />;
  };

  renderHeader = () => {
    return (
      <View style={[styles.wrapper, styles.topWrapper]}>
        <TouchableOpacity onPress={() => this.onSelect({})}>
          <View style={styles.topOption}>
            <Text style={styles.topOptionLabel}>Show all categories</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <SectionList
        sections={this.categorySections}
        keyExtractor={(e, i) => `filter-category-${e}${i}`}
        ListHeaderComponent={this.renderHeader}
        renderSectionHeader={this.renderSectionHeader}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.content}
        style={styles.container}/>
    );
  }
}

export default class CategoryFilterList extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    header: undefined,
    title: "Category"
  });

  constructor(props) {
    super(props);
    // NOTE: navigation state params
    //  title
    //  selectedValue
    //  selected
    //  asyncFetch
    //  clearFilter
    //  setFilter
    this.store = this.props.navigation.getParam("filterStore", () => {});
  }

  componentDidMount() {
    this.store.fetchCategories();
  }

  render() {
    return <Content store={this.store} />;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  content: {
    paddingBottom: NAVBAR_HEIGHT,
    paddingHorizontal: Sizes.InnerFrame
  },

  wrapper: {
    justifyContent: "center",
    paddingVertical: Sizes.InnerFrame,
    borderBottomWidth: Sizes.Hairline,
    borderColor: Colours.Border,
    backgroundColor: Colours.Foreground
  },

  indent: {
    paddingLeft: Sizes.InnerFrame
  },

  option: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Sizes.InnerFrame / 2
  },

  optionLabel: {
    ...Styles.Title,
    ...Styles.Emphasized
  }
});
