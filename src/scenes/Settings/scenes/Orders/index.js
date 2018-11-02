import React from "react";
import { StyleSheet, FlatList } from "react-native";

// third party
import { observer } from "mobx-react/native";

// local
import { Colours, Sizes } from "~/src/constants";
import OrdersUIStore from "./store";
import { Order, EmptyOrders } from "./components";

@observer
export default class Orders extends React.Component {
  static navigationOptions = ({ navigationOptions }) => ({
    ...navigationOptions,
    header: undefined,
    title: "Orders"
  });

  constructor(props) {
    super(props);
    this.store = new OrdersUIStore();
  }

  componentDidMount() {
    this.store.fetch();
  }

  renderItem = ({ item: order }) => {
    return <Order {...order} />;
  };

  get renderEmpty() {
    return <EmptyOrders />;
  }

  render() {
    return (
      <FlatList
        scrollEnabled={false}
        data={this.store.orders.slice()}
        contentContainerStyle={styles.content}
        keyExtractor={order => `${order.id}`}
        ListEmptyComponent={this.renderEmpty}
        renderItem={this.renderItem}/>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  }
});
