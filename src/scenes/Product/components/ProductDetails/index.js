import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Styles, Sizes } from "localyyz/constants";

// local
import ExpandableSection from "../ExpandableSection";
import { ExpandedDescription, SizeChart, UsedIndicator } from "./components";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { observer, inject, Provider } from "mobx-react";

@withNavigation
@inject(stores => ({
  description:
    stores.productStore.product
    && stores.productStore.product.truncatedDescription,
  isSizeChartSupported:
    stores.productStore.product
    && stores.productStore.product.isSizeChartSupported,
  sizeChartType:
    stores.productStore.product
    && stores.productStore.product.category
    && stores.productStore.product.category.value,
  productStore: stores.productStore
}))
@observer
export default class ProductDetails extends React.Component {
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
        <View style={styles.header}>
          <Text style={Styles.Title}>Details</Text>
        </View>
        <ExpandableSection
          title="Product"
          content={this.props.description}
          onExpand={() =>
            this.props.navigation.navigate("Information", {
              title: "Product information",
              content: this.expandedDescriptionComponent
            })
          }/>
        <ExpandableSection
          title="Sizing and fit"
          content="Fits true to size"
          onExpand={
            this.props.isSizeChartSupported
              ? () =>
                  this.props.navigation.navigate("Information", {
                    title: "Sizing and fit",
                    content: <SizeChart type={this.props.sizeChartType} />
                  })
              : null
          }/>
        <UsedIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},

  header: {
    marginVertical: Sizes.InnerFrame / 2
  }
});
