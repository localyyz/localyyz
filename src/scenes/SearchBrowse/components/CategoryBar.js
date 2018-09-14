import React from "react";
import { StyleSheet, FlatList } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";

// local
import CategoryButton from "./CategoryButton";

export default class CategoryBar extends React.Component {
  renderItem = ({ item }) => {
    return (
      <CategoryButton
        {...item}
        isSmall
        onPress={() => this.props.onChangeCategory(item)}/>
    );
  };

  render() {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={this.props.categories}
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
    marginBottom: Sizes.InnerFrame / 2
  },

  list: {
    paddingHorizontal: Sizes.InnerFrame
  }
});
