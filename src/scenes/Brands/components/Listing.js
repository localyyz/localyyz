import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity
} from "react-native";

// custom
import { Colours, Sizes, Styles } from "localyyz/constants";
import { ConstrainedAspectImage } from "localyyz/components";
import { capitalize } from "localyyz/helpers";

// third party
import { withNavigation } from "react-navigation";
import { observer, inject } from "mobx-react/native";

@inject(stores => ({
  fetchNextPage: () => stores.brandsStore.fetchNextPage(),
  brands: stores.brandsStore.brands
}))
@observer
export class Listing extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
    this.renderProduct = this.renderProduct.bind(this);
    this.numProductsBadge = this.numProductsBadge.bind(this);
    this.onProductPress = this.onProductPress.bind(this);
    this.onBrandPress = this.onBrandPress.bind(this);
  }

  componentDidMount() {
    this.props.fetchNextPage();
  }

  numProductsBadge(numProducts) {
    return numProducts > 0 ? (
      <View style={styles.numProductsContainer}>
        <Text style={styles.numProductsLabel}>
          {`view ${numProducts > 1000 ? "1000+" : numProducts} more products`}
        </Text>
      </View>
    ) : null;
  }

  onProductPress(product) {
    this.props.navigation.navigate("Product", {
      product: product
    });
  }

  onBrandPress(brand) {
    this.props.navigation.navigate("ProductList", {
      fetchPath: `${this.props.path}/${brand.id}/products`,
      title: capitalize(brand.name || brand.id),
      subtitle: brand.description
    });
  }

  renderProduct({ item: product }) {
    return (
      <TouchableOpacity onPress={() => this.onProductPress(product)}>
        <View style={productStyles.container}>
          <ConstrainedAspectImage
            constrainHeight={Sizes.SquareButton * 1.5}
            source={{ uri: product.imageUrl }}/>
        </View>
      </TouchableOpacity>
    );
  }

  renderItem({ item }) {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => this.onBrandPress(item)}>
          <View style={styles.header}>
            <View style={styles.title}>
              <Text numberOfLines={1} style={styles.label}>
                {item.name || item.id}
              </Text>
            </View>
            {this.numProductsBadge(item.productCount)}
          </View>
        </TouchableOpacity>
        <View style={styles.products}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={item.products}
            renderItem={this.renderProduct}
            keyExtractor={(e, i) => `${item.id}-products-${i}`}/>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          renderItem={this.renderItem}
          data={this.props.brands.slice()}
          onEndReached={() => this.props.fetchNextPage()}
          keyExtractor={(e, i) => `brand-${i}`}/>
      </View>
    );
  }
}

export default withNavigation(Listing);

const styles = StyleSheet.create({
  container: {
    marginVertical: Sizes.InnerFrame
  },

  row: {
    paddingVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.InnerFrame
  },

  header: {
    ...Styles.Horizontal,
    ...Styles.EqualColumns
  },

  products: {
    paddingTop: Sizes.InnerFrame
  },

  title: {
    flex: 1,
    marginRight: Sizes.InnerFrame
  },

  label: {
    ...Styles.Text,
    ...Styles.Emphasized
  },

  numProductsContainer: {
    paddingVertical: Sizes.InnerFrame / 4,
    paddingHorizontal: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Primary,
    alignItems: "center",
    justifyContent: "center"
  },

  numProductsLabel: {
    ...Styles.Text,
    ...Styles.Terminal,
    ...Styles.TinyText,
    ...Styles.Alternate
  }
});

const productStyles = StyleSheet.create({
  container: {
    marginRight: Sizes.InnerFrame / 2
  }
});
