import React from "react";
import { FlatList } from "react-native";

// local
import SortBy from "./SortBy";

// constants
const SORT_BY = [
  { label: "Recommended" },
  { label: "What's new", value: "-created_at" },
  { label: "Price (Low to high)", value: "price" },
  { label: "Price (High to low)", value: "-price" },
  { label: "Discount (High to low, % off)", value: "-discount" }
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
