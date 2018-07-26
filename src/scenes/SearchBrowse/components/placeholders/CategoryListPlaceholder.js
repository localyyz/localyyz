import React from "react";
import { FlatList } from "react-native";

// third party
import PropTypes from "prop-types";

// local
import CategoryPlaceholder from "./CategoryPlaceholder";

export default class CategoryListPlaceholder extends React.Component {
  static propTypes = {
    limit: PropTypes.number
  };

  static defaultProps = {
    limit: 5
  };

  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem() {
    return <CategoryPlaceholder />;
  }

  render() {
    return (
      <FlatList
        scrollEnabled={false}
        data={new Array(this.props.limit).fill()}
        renderItem={this.renderItem}
        keyExtractor={(e, i) => `placeholder-${i}`}/>
    );
  }
}
