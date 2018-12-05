import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Sizes, Colours } from "localyyz/constants";
import Favourite from "~/src/components/ProductTileV2/Favourite";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// local
import ExpandableSection from "../ExpandableSection";
import { ExpandedDescription, UsedIndicator } from "./components";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { observer, inject, Provider } from "mobx-react/native";
import { toPriceString } from "localyyz/helpers";

@inject(stores => ({
  title: stores.productStore.product && stores.productStore.product.title,
  brand: stores.productStore.product && stores.productStore.product.brand,
  product: stores.productStore.product && stores.productStore.product,
  oneSize: stores.productStore.product && stores.productStore.product.isOneSize,
  stock:
    stores.productStore.product && stores.productStore.product.associatedStock,
  inStock:
    stores.productStore.selectedVariant
    && stores.productStore.selectedVariant.limits > 0,
  sizes:
    stores.productStore.product
    && stores.productStore.product.associatedSizes.length,
  price:
    stores.productStore.product && stores.productStore.product.price.toFixed(0),
  previousPrice:
    stores.productStore.product
    && toPriceString(stores.productStore.product.previousPrice),
  valueOff: stores.productStore.product && stores.productStore.product.valueOff,
  description:
    stores.productStore.product
    && stores.productStore.product.truncatedDescription,
  productStore: stores.productStore
}))
@observer
export class ProductDetails extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,

    // mobx injected
    productStore: PropTypes.object.isRequired,
    description: PropTypes.string,
    isSizeChartSupported: PropTypes.bool,
    sizeChartType: PropTypes.string
  };

  static defaultProps = {
    description: "",
    isSizeChartSupported: false
  };

  get stockMessage() {
    return (
      <View
        style={{
          paddingTop: Sizes.InnerFrame / 2,
          flexDirection: "row"
        }}>
        <Text style={styles.lowStock}>
          {`Only ${this.props.stock} available`}
        </Text>
        {!this.props.oneSize ? (
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.lowStock}>{`in ${this.props.sizes}`}</Text>
            {this.props.sizes === 1 ? (
              <Text style={styles.lowStock}>{" size!"}</Text>
            ) : (
              <Text style={styles.lowStock}>{" sizes!"}</Text>
            )}
          </View>
        ) : (
          <Text style={styles.lowStock}>!</Text>
        )}
      </View>
    );
  }

  get expandedDescriptionComponent() {
    return (
      <Provider productStore={this.props.productStore}>
        <ExpandedDescription />
      </Provider>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.productTitle}>{this.props.title}</Text>
          <View style={styles.brandContainer}>
            <Text style={styles.productBrand}>{this.props.brand}</Text>
          </View>
          <View style={styles.priceLine}>
            <View>
              <Text style={styles.productPrice}>{`$${this.props.price}`}</Text>
              {this.props.valueOff > 1 ? (
                <Text style={styles.previousPrice}>
                  {`Was ${this.props.previousPrice}`}
                </Text>
              ) : null}
            </View>
            <View style={{ flexDirection: "row" }}>
              {this.props.valueOff > 1 ? (
                <View style={{ alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcon
                      name={"stars"}
                      color={Colours.Accented}
                      size={Sizes.H3}/>
                    <Text style={styles.dealText}> You're saving</Text>
                    <Text style={styles.dealTextValue}>
                      {` ${"$"}${this.props.valueOff} `}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </View>
        {this.props.stock < 10 && this.props.inStock ? this.stockMessage : null}
        <ExpandableSection
          title="Details"
          content={this.props.description}
          onExpand={() => {
            this.props.navigation.navigate("Modal", {
              type: "product detail",
              title: `${this.props.title}`,
              component: this.expandedDescriptionComponent
            });
          }}/>
        <UsedIndicator />
      </View>
    );
  }
}

export default withNavigation(ProductDetails);

const styles = StyleSheet.create({
  container: {},

  brandContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  priceLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Sizes.InnerFrame
  },

  productTitle: {
    fontSize: Sizes.Text,
    fontWeight: Sizes.Bold
  },

  productBrand: {
    fontSize: Sizes.MediumText,
    fontWeight: Sizes.Medium,
    color: Colours.SubduedText
  },

  productPrice: {
    fontSize: Sizes.MediumText,
    fontWeight: Sizes.Medium
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
  },

  lowStock: {
    color: Colours.RoseRed
  }
});
