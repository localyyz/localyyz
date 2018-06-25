import React from "react";
import { ActivityIndicator, StyleSheet, View, FlatList } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";
import Accordion from "react-native-collapsible/Accordion";

// custom
import { Sizes, Styles } from "localyyz/constants";

// local
import Category from "./Category";
import Gender from "./Gender";
import SelectedFilter from "./SelectedFilter";

// constants
const GENDER_SECTION = [
  { label: "Women", value: "woman" },
  { label: "Men", value: "man" }
];

@inject(stores => ({
  fetchCategories: stores.filterStore.fetchCategories,
  clearFilter: stores.filterStore.clearCategoryFilter,
  categories: stores.filterStore.categories || [],
  selected: stores.filterStore.subcategory || stores.filterStore.category,
  gender: stores.filterStore.gender
}))
@observer
export default class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeSection: 0 };

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this._renderHeader = this._renderHeader.bind(this);
    this._renderContent = this._renderContent.bind(this);
  }

  componentDidMount() {
    this.props.fetchCategories();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gender !== this.props.gender) {
      this.setState({ activeSection: this.props.gender == "woman" ? 0 : 1 });
    }
  }

  renderItem({ item: category }) {
    return <Category {...category} />;
  }

  _renderHeader(content /*index, isActive, sections*/) {
    return (
      <View style={styles.row}>
        <Gender label={content.label} value={content.value} />
      </View>
    );
  }

  // TODO: this should really respect the title and not just use the value name
  // currently not possible since category lists are gone when drilling down

  _renderContent(/*content, index, isActive, sections*/) {
    return (
      <View style={styles.content}>
        {this.props.selected ? (
          <View style={styles.selected}>
            <SelectedFilter onClear={this.props.clearFilter}>
              {this.props.selected}
            </SelectedFilter>
          </View>
        ) : null}
        <FlatList
          scrollEnabled={false}
          data={this.props.categories.slice()}
          keyExtractor={item => item.title}
          renderItem={this.renderItem}
          ListFooterComponent={
            <ActivityIndicator
              style={styles.footer}
              size="small"
              hidesWhenStopped={true}
              animating={!this.props.categories.length}/>
          }/>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Accordion
          activeSection={this.state.activeSection}
          sections={GENDER_SECTION}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  content: {
    alignItems: "flex-start"
  },

  row: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  selected: {
    marginVertical: Sizes.InnerFrame
  },

  footer: {
    paddingVertical: Sizes.InnerFrame / 3
  }
});
