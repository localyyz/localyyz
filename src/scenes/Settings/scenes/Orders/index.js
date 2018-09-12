import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// third party
import { observer } from "mobx-react/native";

// custom
import { BaseScene } from "localyyz/components";

// local
import OrdersUIStore from "./store";
import { Order, EmptyOrders } from "./components";

@observer
export default class Orders extends React.Component {
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
      <BaseScene
        backAction={this.props.navigation.goBack}
        title="Order history">
        <View style={styles.content}>
          <FlatList
            scrollEnabled={false}
            data={this.store.orders.slice()}
            keyExtractor={order => `${order.id}`}
            ListEmptyComponent={this.renderEmpty}
            renderItem={this.renderItem}/>
        </View>
      </BaseScene>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
});
