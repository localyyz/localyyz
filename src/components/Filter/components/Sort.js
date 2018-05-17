import React from "react";
import { FlatList } from "react-native";

// local
import SortBy from "./SortBy";

// constants
const SORT_BY = [
  { label: "Recommended" },
  { label: "What's new", value: "new" },
  { label: "Price (Ascending)", value: "price_asc" },
  { label: "Price (Descending)", value: "price_desc" },
  { label: "Discount", value: "discount" }
];

export default class Sort extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item: sorter }) {
    return <SortBy {...sorter} />;
  }

  render() {
    return (
      <FlatList
        scrollEnabled={false}
        data={SORT_BY}
        keyExtractor={item => item.value || "default"}
        renderItem={this.renderItem}/>
    );
  }
}
