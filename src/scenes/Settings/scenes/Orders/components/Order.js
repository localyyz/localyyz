import React from "react";
import { View, StyleSheet } from "react-native";

import Moment from "moment";

// custom
import { Sizes } from "localyyz/constants";
import { Forms } from "localyyz/components";
import OrderItem from "./OrderItem";

const DATE_FORMAT = "dddd, MMMM Do, YYYY";

export default class Order extends React.Component {
  render() {
    return (
      <View>
        <Forms.BaseField
          label={Moment(this.props.createdAt).format(DATE_FORMAT)}/>
        <View style={styles.container}>
          <OrderItem item={this.props.items[0]} order={this.props} />;
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame / 2
  }
});
