import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { action, runInAction, observable } from "mobx";
import { inject, observer } from "mobx-react/native";

// custom
import { Colours, Sizes } from "~/src/constants";
import { Category as CategoryStore } from "~/src/stores";

// local
import CategoryButton, { BUTTON_HEIGHT } from "./categoryButton";

export const BAR_HEIGHT = BUTTON_HEIGHT + Sizes.InnerFrame;

@inject(stores => ({
  onChangeCategory: stores.filterStore.setCategoryV2Filter,
  filterGender: stores.filterStore.gender
}))
@observer
export default class CategoryHeader extends React.Component {
  @observable categories = [];
  @observable parent;
  @observable selected;

  componentDidMount() {
    // todo: from parent
    const category = this.props.category
      ? this.props.category
      : { id: this.props.filterGender == "man" ? 10000 : 20000, title: "All" };
    this.selected = category;
    this.fetchCategories(category);
  }

  fetchCategories = category => {
    CategoryStore.fetchOne(category.id).then(resolved => {
      runInAction("[ACTION] fetch categories", () => {
        let categories = [];
        category.parent && categories.push(category);
        if (resolved.category) {
          categories = categories.concat(
            resolved.category.values.map(c => ({
              ...c,
              parent: category
            }))
          );
        }
        categories = categories.length > 0 ? categories : [category];
        this.categories.replace(categories);
      });
    });
  };

  @action
  onSelectCategory = category => {
    if (this.selected && this.selected.id === category.id) {
      // deselect
      if (category.parent) {
        this.selected = category.parent;
        this.fetchCategories(category.parent);
        this.props.onChangeCategory(category.parent.id);
      }
    } else {
      this.selected = category;
      this.fetchCategories(category);
      this.props.onChangeCategory(category.id);
    }
  };

  renderItem = ({ item: category }) => {
    return (
      <CategoryButton
        {...category}
        selected={this.selected}
        onPress={() => this.onSelectCategory(category)}/>
    );
  };

  render() {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={this.categories.slice()}
        renderItem={this.renderItem}
        style={styles.container}
        contentContainerStyle={styles.list}
        keyExtractor={cat => `catbar${cat.id}`}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground,
    paddingVertical: Sizes.InnerFrame / 2
  },

  list: {
    paddingHorizontal: Sizes.InnerFrame
  }
});
