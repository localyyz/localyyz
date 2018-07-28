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
import { paramsAction, randInt } from "localyyz/helpers";
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
  constructor(props) {
    super(props);

    // data
    this._parentCategoryId;

    // pseudo-unique (law of large numbers) key seed
    this._keySeed = randInt(10000000) + 1;

    // bindings
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.renderCategory = this.renderCategory.bind(this);
    this.renderSubcategory = this.renderSubcategory.bind(this);
    this.buildParams = this.buildParams.bind(this);
  }

  componentDidMount() {
    this.props.fetch();
  }

  buildParams({ title, id }, parentId) {
    return {
      fetchPath: `categories/${id}/products`,
      title: title,
      hideCategories: true,
      hideGenderFilter: true,
      gender: this.props.gender,
      listHeader: (
        <CategoryBar
          id={parentId || id}
          onChangeCategory={this.onChangeCategory}
          store={this.props.store}/>
      )
    };
  }

  onChangeCategory(category) {
    // this dispatches the changed category to product list store
    GA.trackEvent("category", category.id);
    this.props.navigation.dispatch(
      paramsAction(
        CATEGORY_PRODUCT_LIST_KEY,
        this.buildParams(category, this._parentCategoryId)
      )
    );
  }

  onSelectCategory(category) {
    this._parentCategoryId = category.id;
    this.props.navigation.navigate({
      params: this.buildParams(category),
      routeName: "ProductList",
      key: CATEGORY_PRODUCT_LIST_KEY
    });
  }

  renderSubcategory({ item: category }) {
    return (
      <TouchableOpacity onPress={() => this.onSelectCategory(category)}>
        <CategoryButton {...category} />
      </TouchableOpacity>
    );
  }

  renderCategory({ item: category }) {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => this.onSelectCategory(category)}>
          <View style={styles.header}>
            <Text style={styles.title}>{category.title}</Text>
            <View style={styles.button}>
              <Text style={styles.buttonLabel}>View</Text>
            </View>
          </View>
        </TouchableOpacity>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={category.values.slice() || []}
          renderItem={this.renderSubcategory}
          initialNumToRender={3}
          contentContainerStyle={styles.category}
          keyExtractor={(c, i) =>
            `${this._keySeed}-cat${category.id}-row${i}-subcat${c.id}`
          }/>
      </View>
    );
  }

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
        <CategoryGender />
        <FlatList
          scrollEventThrottle={16}
          onScroll={this.props.onScroll}
          showsVerticalScrollIndicator={false}
          data={this.props.categories}
          renderItem={this.renderCategory}
          initialNumToRender={4}
          contentContainerStyle={[styles.list, this.props.style]}
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

  header: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns,
    padding: Sizes.InnerFrame
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.Title
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
    paddingHorizontal: Sizes.InnerFrame
  }
});
