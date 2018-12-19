import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { observer, inject } from "mobx-react/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// custom
import { toPriceString } from "localyyz/helpers";
import { Sizes, Colours, Styles } from "localyyz/constants";

@inject(stores => ({
  store: stores.productStore
}))
@observer
export class ProductDetails extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    //
  };

  constructor(props) {
    super(props);
    this.state = {
      inventorySum: this.props.store.product.variants
        .map(v => v.limits)
        .reduce((a, b) => a + b, 0),
      price: props.store.price,
      prevPrice: props.store.prevPrice,
      color: props.store.selectedColor,
      title: props.store.product.title
    };
  }

  get stockMessage() {
    return (
      <View style={styles.stockLine}>
        <Text style={styles.lowStock}>
          {this.state.inventorySum > 0
            ? `Only ${this.state.inventorySum} available`
            : "Out of Stock"}
        </Text>
      </View>
    );
  }

  get priceMessage() {
    return (
      <View style={styles.priceLine}>
        <View>
          <Text style={styles.price}>{`${toPriceString(
            this.state.price
          )}`}</Text>
          {this.state.prevPrice ? (
            <Text style={styles.previousPrice}>
              {`Was ${toPriceString(this.state.prevPrice)}`}
            </Text>
          ) : null}
        </View>
        <View style={{ flexDirection: "row" }}>
          {this.state.prevPrice ? (
            <View style={{ alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcon
                  name={"stars"}
                  color={Colours.Accented}
                  size={Sizes.H3}/>
                <Text style={styles.dealText}> You're saving</Text>
                <Text style={styles.dealTextValue}>
                  {toPriceString(this.state.prevPrice - this.state.price)}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  render() {
    const title = this.state.color
      ? `${this.state.title} in ${this.state.color}`
      : this.state.title;

    return (
      <View style={styles.container}>
        {this.priceMessage}
        {this.state.inventorySum < 10 ? this.stockMessage : null}
        <Text numberOfLines={3} style={styles.title}>
          {title}
        </Text>
      </View>
    );
  }
}

export default withNavigation(ProductDetails);

const styles = StyleSheet.create({
  container: {
    ...Styles.Card,
    paddingTop: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame / 8
  },

  stockLine: {
    paddingTop: Sizes.InnerFrame / 2,
    flexDirection: "row"
  },

  lowStock: {
    color: Colours.RoseRed
  },

  priceLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Sizes.InnerFrame
  },

  title: {
    fontSize: Sizes.SmallText,
    color: Colours.LabelGrey,
    paddingVertical: Sizes.InnerFrame
  },

  price: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  previousPrice: {
    fontSize: Sizes.TinyText,
    fontWeight: Sizes.Medium,
    color: Colours.SubduedText
  },

  dealText: {
    fontSize: Sizes.SmallText,
    fontWeight: Sizes.Medium
  },
  dealTextValue: {
    fontSize: Sizes.SmallText,
    fontWeight: Sizes.Bold
  }
});
