import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
//import Moment from "moment";

// custom
import { Sizes, Styles, Colours } from "localyyz/constants";
import { ConstrainedAspectImage } from "localyyz/components";

export default class OrderItem extends React.Component {
  constructor(props) {
    super(props);
    this.product = this.props.item.product;
    this.photo = this.product.images[0];
    this.order = this.props.order;
  }

  get status() {
    switch (this.statusCode) {
      case 2:
        return "Order completed. Check your email for status.";
      case 1:
        return "Order processing";
      default:
        return "Incomplete";
    }
  }

  get statusCode() {
    switch (this.order.status) {
      case "completed":
        return 2;
      case "payment_success":
        return 1;
      case "inprogress":
      case "checkout":
      default:
        return 0;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.photo}>
          <ConstrainedAspectImage
            source={{
              uri: this.photo && this.photo.imageUrl
            }}
            sourceWidth={this.photo && this.photo.width}
            sourceHeight={this.photo && this.photo.height}
            constrainWidth={Sizes.Width / 4}
            constrainHeight={Sizes.Width / 4}/>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>{this.product.title}</Text>
          <View
            style={[
              styles.status,
              this.statusCode > 0 && styles.completeStatus
            ]}>
            <Text
              style={[
                styles.label,
                styles.statusLabel,
                this.statusCode > 0 && styles.completeStatusLabel
              ]}>
              {this.status}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Styles.Horizontal,
    padding: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground,
    borderBottomWidth: Sizes.Spacer,
    borderBottomColor: Colours.Background
  },

  photo: {
    width: Sizes.Width / 4,
    height: Sizes.Width / 4,
    alignItems: "center",
    justifyContent: "center"
  },

  content: {
    flex: 1,
    marginVertical: Sizes.InnerFrame,
    marginLeft: Sizes.InnerFrame
  },

  label: {
    ...Styles.Text,
    ...Styles.SmallText
  },

  status: {
    marginTop: Sizes.InnerFrame / 2
  },

  statusLabel: {
    ...Styles.Emphasized
  },

  completeStatusLabel: {
    color: Colours.Success
  }
});
