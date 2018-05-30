import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { Sizes } from "localyyz/constants";

// local
import Category from "./Category";

export default class Categories extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item: category }) {
    return <Category {...category} />;
  }

  render() {
    return (
      <FlatList
        scrollEnabled={false}
        data={this.props.categories}
        keyExtractor={item => item.title}
        renderItem={this.renderItem}
        contentContainerStyle={styles.container}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.InnerFrame / 2
  }
});
