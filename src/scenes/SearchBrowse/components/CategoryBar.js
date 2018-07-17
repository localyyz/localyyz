import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";

// third party
import { observable, action } from "mobx";
import { Provider, observer, inject } from "mobx-react/native";

// custom
import { Colours, Sizes } from "localyyz/constants";

// local
import CategoryButton from "./CategoryButton";

@observer
export default class CategoryBar extends React.Component {
  @observable selectedCategory = "";

  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  @action
  onChangeCategory({ title, id }) {
    this.selectedCategory = id;
    this.props.onChangeCategory
      && this.props.onChangeCategory({ title: title, id: id });
  }

  renderItem({ item }) {
    return (
      <CategoryBarItem
        {...item}
        onChangeCategory={id => this.onChangeCategory(id)}/>
    );
  }

  render() {
    const categories = this.props.store.categories
      .filter(cat => cat.id === this.props.id)
      .map(cat => cat.values)[0];

    return (
      <Provider categoryComponent={this}>
        <View style={styles.container}>
          {categories && categories.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              renderItem={this.renderItem}
              contentContainerStyle={styles.list}
              keyExtractor={cat => cat.id}/>
          ) : null}
        </View>
      </Provider>
    );
  }
}

@inject((stores, props) => ({
  isSelected: stores.categoryComponent.selectedCategory === props.id
}))
@observer
class CategoryBarItem extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    return (
      this.props.onChangeCategory && this.props.onChangeCategory(this.props)
    );
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onChange}>
        <CategoryButton isSmall {...this.props} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground
  },

  list: {
    marginBottom: Sizes.InnerFrame / 2,
    paddingHorizontal: Sizes.InnerFrame
  }
});
