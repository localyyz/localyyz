import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// third party
import Moment from "moment";

// custom
import { Sizes } from "localyyz/constants";
import { Forms } from "localyyz/components";

// local
import { OrderItem } from "./components";

// constants
const DATE_FORMAT = "dddd, MMMM Do, YYYY";

export default class Order extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item }) {
    return <OrderItem item={item} order={this.props} />;
  }

  render() {
    return this.props.items && this.props.items.length > 0 ? (
      <View>
        <Forms.BaseField
          label={Moment(this.props.createdAt).format(DATE_FORMAT)}/>
        <View style={styles.container}>
          <FlatList
            scrollEnabled={false}
            data={this.props.items}
            keyExtractor={item => `${item.id}`}
            renderItem={this.renderItem}/>
        </View>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 2
  }
});
