import React from "react";
import { View, StyleSheet } from "react-native";

// local
import ExpandableSection from "../ExpandableSection";
import { ExpandedDescription, SizeChart, UsedIndicator } from "./components";

// third party
import PropTypes from "prop-types";
import { withNavigation } from "react-navigation";
import { observer, inject, Provider } from "mobx-react/native";

@inject(stores => ({
  title: stores.productStore.product && stores.productStore.product.title,
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
        <ExpandableSection title="Product" content={this.props.title} />
        <ExpandableSection
          title="Details"
          content={this.props.description}
          onExpand={() =>
            this.props.navigation.push("Information", {
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
                  this.props.navigation.push("Information", {
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

export default withNavigation(ProductDetails);

const styles = StyleSheet.create({
  container: {}
});
