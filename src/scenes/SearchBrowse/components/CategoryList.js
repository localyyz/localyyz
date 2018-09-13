import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";

// third party
import { observer, inject } from "mobx-react/native";
import { withNavigation } from "react-navigation";

// custom
import { Colours, Sizes, Styles, NAVBAR_HEIGHT } from "localyyz/constants";
import { GA } from "localyyz/global";

// local
import CategoryBar from "./CategoryBar";
import CategoryButton from "./CategoryButton";
import CategoryGender from "./CategoryGender";
import { CategoryListPlaceholder } from "./placeholders";

// constants
const CATEGORY_PRODUCT_LIST_KEY = "categoryProductList";

@inject(stores => ({
  store: stores.searchStore,
  fetch: stores.searchStore.fetchCategories,
  gender: stores.searchStore.gender && stores.searchStore.gender.id,
  categories:
    stores.searchStore.categories && stores.searchStore.categories.slice()
}))
@observer
export class CategoryList extends React.Component {
  componentDidMount() {
    this.props.fetch();
  }

  buildParams = ({ title, id, values }) => {
    return {
      fetchPath: `categories/${id}/products`,
      title: title,
      hideCategories: true,
      hideGenderFilter: !!this.props.gender,
      gender: this.props.gender,
      listHeader: (
        <CategoryBar
          categories={values}
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

  renderSubcategory = ({ item: category }) => {
    return (
      <CategoryButton
        {...category}
        onPress={() => this.onSelectCategory(category)}/>
    );
  };

  renderCategory = ({ item: category }) => {
    return (
      <FlatList
        bounces={false}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        data={category.values.slice() || []}
        renderItem={this.renderSubcategory}
        ListHeaderComponent={
          <TouchableOpacity onPress={() => this.onSelectCategory(category)}>
            <View style={styles.header}>
              <Text style={styles.title}>{category.title.toUpperCase()}</Text>
              <View style={styles.button}>
                <Text style={styles.buttonLabel}>View all</Text>
              </View>
            </View>
          </TouchableOpacity>
        }
        ListFooterComponent={<View style={styles.separator} />}
        columnWrapperStyle={styles.category}
        keyExtractor={c => `category${c.id}`}/>
    );
  };

  get placeholder() {
    return (
      <View style={styles.placeholder}>
        <CategoryListPlaceholder />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          onScroll={this.props.onScroll}
          scrollEventThrottle={16}
          data={this.props.categories}
          contentContainerStyle={[styles.list, this.props.style]}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderCategory}
          initialNumToRender={4}
          ListHeaderComponent={<CategoryGender />}
          ListEmptyComponent={this.placeholder}
          keyExtractor={(c, i) => `${this._keySeed}-row${i}-cat${c.id}`}/>
      </View>
    );
  }
}

export default withNavigation(CategoryList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Sizes.ScreenTop + Sizes.OuterFrame
  },

  list: {
    paddingBottom: NAVBAR_HEIGHT + Sizes.OuterFrame
  },

  separator: {
    padding: Sizes.InnerFrame,
    marginHorizontal: Sizes.InnerFrame,
    borderColor: Colours.Background,
    borderBottomWidth: 1
  },

  header: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    padding: Sizes.InnerFrame
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
  },

  category: {
    justifyContent: "space-around",
    paddingBottom: Sizes.InnerFrame
  }
});
