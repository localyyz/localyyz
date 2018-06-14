import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";

// custom
import { Sizes } from "localyyz/constants";

// local
import Category from "./Category";

@inject(stores => ({
  categoryFilter: stores.filterStore.categoryFilter
}))
@observer
export default class Categories extends React.Component {
  static propTypes = {
    categoryFilter: PropTypes.array
  };

  static defaultProps = {
    categoryFilter: []
  };

  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item: category }) {
    return <Category {...category} />;
  }

  render() {
    return this.props.categoryFilter.length > 0 ? (
      <View>
        <Text>By type</Text>
        <FlatList
          scrollEnabled={false}
          data={this.props.categoryFilter}
          keyExtractor={item => item.title}
          renderItem={this.renderItem}
          contentContainerStyle={styles.container}/>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.InnerFrame / 2
  }
});
