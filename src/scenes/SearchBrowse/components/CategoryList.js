import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList
} from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";
import { GA } from "localyyz/global";

// local
import CategoryButton, { BUTTON_PADDING } from "./CategoryButton";
import CategoryGender from "./CategoryGender";

// constants
const CATEGORY_PRODUCT_LIST_KEY = "categoryProductList";

@inject(stores => ({
  store: stores.searchStore,
  fetch: stores.searchStore.fetchCategories,
  gender: stores.searchStore.gender && stores.searchStore.gender.id,
  setGender: stores.searchStore.setGender,
  categories: stores.searchStore.categories
    ? stores.searchStore.categories.slice()
    : []
}))
@observer
export class CategoryList extends React.Component {
  componentDidMount() {
    this.props.fetch();
  }

  buildParams = category => {
    return {
      fetchPath: `categories/${category.id}/products`,
      title: category.title,
      gender: this.props.gender,
      category: category
    };
  };

  // this selects a category from the main search browse screen
  onSelectCategory = category => {
    GA.trackEvent(
      "category",
      "select",
      `${this.props.gender}-${category.title}`
    );
    this.props.navigation.navigate({
      routeName: "ProductList",
      params: this.buildParams(category),
      key: `${CATEGORY_PRODUCT_LIST_KEY}-${category.id}`
    });
  };

  renderItem = ({ section, index }) => {
    // NOTE: this is a hack version of numcolumns = 2 with sectioned list

    // skip the odd number columns because it was
    // already handled by even numbered once
    if (index % 2 > 0) return null;

    const rowItems = [section.data[index]];
    if (index + 1 < section.data.length) {
      rowItems.push(section.data[index + 1]);
    }

    return (
      <View
        key={"row-" + rowItems.map(d => d.id).join("-")}
        style={{
          paddingBottom: BUTTON_PADDING,
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
        {rowItems.map(d => (
          <CategoryButton
            key={`cat-${d.id}`}
            {...d}
            onPress={() => this.onSelectCategory(d)}/>
        ))}
      </View>
    );
  };

  renderSectionHeader = ({ section: category }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => this.onSelectCategory(category)}>
        <View style={styles.header}>
          <Text style={styles.title}>{category.title.toUpperCase()}</Text>
          <View style={styles.button}>
            <Text style={styles.buttonLabel}>View all</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderSectionFooter = () => {
    return <View style={styles.separator} />;
  };

  renderHeader = () => {
    return (
      <CategoryGender
        key={`gender-${this.props.gender.id}`}
        setGender={this.props.setGender}
        gender={this.props.gender}/>
    );
  };

  render() {
    return (
      <SectionList
        sections={this.props.categories}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
        scrollEventThrottle={16}
        initialNumToRender={8}
        contentContainerStyle={styles.list}
        style={styles.container}/>
    );
  }
}

export default withNavigation(CategoryList);

const styles = StyleSheet.create({
  container: {
    flex: 1
    //marginHorizontal: BUTTON_PADDING
    //paddingTop: Sizes.ScreenTop + Sizes.OuterFrame
  },

  list: {
    justifyContent: "center",
    paddingHorizontal: BUTTON_PADDING,
    paddingBottom: NAVBAR_HEIGHT + Sizes.OuterFrame
  },

  separator: {
    paddingTop: BUTTON_PADDING,
    paddingBottom: Sizes.InnerFrame,
    borderColor: Colours.Background,
    borderBottomWidth: 1,
    width: Sizes.Width
  },

  header: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    padding: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground,
    width: Sizes.Width
  },

  title: {
    ...Styles.Text
  },

  button: {
    ...Styles.RoundedButton,
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 4,
    backgroundColor: Colours.Action
  },

  buttonLabel: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.TinyText
  }
});
