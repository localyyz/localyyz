import React from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { Styles, Colours, Sizes } from "localyyz/constants";

// custom
import { ProductTileV2 } from "localyyz/components";

// third party
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react/native";
import PropTypes from "prop-types";

@inject(stores => ({
  product: stores.productStore.product
}))
@observer
export class ColourVariants extends React.Component {
  static propTypes = {
    // mobx injected
    product: PropTypes.object.isRequired
  };

  renderItem = ({ item: color }) => {
    return (
      <View style={styles.tile}>
        <ProductTileV2 product={this.props.product} selectedColor={color} />
      </View>
    );
  };

  render() {
    return this.props.product.colors.length > 0 ? (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Other Colors</Text>
        </View>
        <View style={styles.content}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={this.props.product.colors.slice()}
            keyExtractor={item => item}
            renderItem={this.renderItem}
            contentContainerStyle={styles.splitList}/>
        </View>
      </View>
    ) : null;
  }
}

export default withNavigation(ColourVariants);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colours.Foreground,
    marginVertical: Sizes.InnerFrame,
    paddingBottom: Sizes.InnerFrame
  },

  header: {
    paddingVertical: Sizes.InnerFrame,
    marginHorizontal: Sizes.InnerFrame,
    backgroundColor: Colours.Transparent
  },

  title: {
    ...Styles.Text,
    ...Styles.Emphasized,
    marginTop: Sizes.InnerFrame / 2
  },

  tile: {
    paddingHorizontal: Sizes.InnerFrame / 2
  },

  splitList: {
    paddingHorizontal: Sizes.InnerFrame
  }
});
