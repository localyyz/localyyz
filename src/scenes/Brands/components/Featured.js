import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import Brand from "../../Home/blocks/Brands/components/Brand";

// third party
import { observer, inject } from "mobx-react/native";

@inject(stores => ({
  fetchFeatured: () => stores.brandsStore.fetchFeatured(),
  brands: stores.brandsStore.featured.filter(brand => brand.imageUrl)
}))
@observer
export default class Featured extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.fetchFeatured();
  }

  renderItem({ item }) {
    return (
      <Brand
        title={item.name}
        numProducts={item.productCount}
        imageUri={item.imageUrl}
        fetchPath={`${this.props.path}/${item.id || item.name}/products`}
        shouldShowName={this.props.shouldShowName}/>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          numColumns={3}
          renderItem={this.renderItem}
          data={this.props.brands.slice()}
          keyExtractor={(e, i) => `brand-${i}`}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Sizes.OuterFrame,
    paddingHorizontal: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  }
});
