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
import CategoryBar from "./CategoryBar";
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

  buildParams = ({ title, id, data }) => {
    return {
      fetchPath: `categories/${id}/products`,
      title: title,
      hideCategories: true,
      hideGenderFilter: !!this.props.gender,
      gender: this.props.gender,
      listHeader: (
        <CategoryBar
          categories={data}
          onChangeCategory={this.onChangeCategory}
          store={this.props.store}/>
      )
    };
  };

  // this changes the category from the top category bar
  onChangeCategory = category => {
    // this dispatches the changed category to product list store
    GA.trackEvent(
      "category",
      "change category",
      `${this.props.gender}-${category.title}`
    );
    this.props.navigation.navigate({
      routeName: "ProductList",
      params: this.buildParams(category),
      key: `${CATEGORY_PRODUCT_LIST_KEY}-${category.id}`
    });
  };

  // this selects a category from the main search browse screen
  onSelectCategory = category => {
    GA.trackEvent(
      "category",
      "select category",
      `${this.props.gender}-${category.title}`
    );
    this.props.navigation.navigate({
      routeName: "ProductList",
      params: this.buildParams(category)
    });
  };

  renderItem = ({ item: category }) => {
    return (
      <CategoryButton
        {...category}
        onPress={() => this.onSelectCategory(category)}/>
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
        numColumns={2}
        contentContainerStyle={styles.list}
        style={styles.container}
        keyExtractor={c => `cat${c.id}`}/>
    );
  }
}

export default withNavigation(CategoryList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: BUTTON_PADDING
    //paddingTop: Sizes.ScreenTop + Sizes.OuterFrame
  },

  list: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
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
