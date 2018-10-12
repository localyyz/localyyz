import React from "react";
import { StyleSheet, FlatList } from "react-native";

// custom
import { Colours } from "localyyz/constants";

// third party
import PropTypes from "prop-types";

// local
import List from "../components/List";

export default class CollectionList extends React.Component {
  static propTypes = {
    collections: PropTypes.object.isRequired,
    title: PropTypes.string
  };

  static defaultProps = {
    limit: 4,
    withMargin: false,
    backgroundColor: Colours.Background
  };

  renderItem = ({ item }) => {
    return (
      <List
        {...item}
        withMargin
        fetchFrom={item.path}
        limit={item.limit ? item.limit : 4}/>
    );
  };

  render() {
    return (
      <FlatList
        ref="blocks"
        data={this.props.collections.slice()}
        keyExtractor={c => `block-${c.id}`}
        contentContainerStyle={styles.content}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}/>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colours.Background
  }
});
