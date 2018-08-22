import React from "react";
import { View, StyleSheet, Text } from "react-native";

// third party
import { inject, observer } from "mobx-react/native";

// custom
import { Sizes, Styles } from "localyyz/constants";
import { Forms } from "localyyz/components";

@inject(stores => ({
  discountCode: stores.cartStore.discountCode
}))
@observer
export default class CouponSection extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.addCoupon = this.addCoupon.bind(this);
  }

  addCoupon() {
    return this.props.navigation.navigate("DiscountScene");
  }

  render() {
    return (
      <View style={styles.coupon}>
        <Forms.BaseField label="Coupon code" onPress={this.addCoupon}>
          <Text testID="couponLabel" numberOfLines={1} style={styles.detail}>
            {this.props.discountCode || "Apply a coupon code"}
          </Text>
        </Forms.BaseField>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  detail: {
    ...Styles.Text,
    ...Styles.Emphasized,
    ...Styles.SmallText
  },

  coupon: {
    marginHorizontal: Sizes.InnerFrame
  }
});
