import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { ProductTile, ProductList } from "localyyz/components";

// third party
import { observer } from "mobx-react/native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import { PropTypes as mobxPropTypes } from "mobx-react/native";

// local
import ListHeader from "./ListHeader";
import MoreFooter from "./MoreFooter";

@observer
export class List extends React.Component {
  static propTypes = {
    // listData input type take a look at home store
    //  fetchFeaturedProducts
    //  fetchDiscountedProducts
    // and https://github.com/mobxjs/mobx-utils#lazyobservable
    listData: mobxPropTypes.objectOrObservableObject,
    title: PropTypes.string.isRequired,
    hideHeader: PropTypes.bool,
    description: PropTypes.string,
    withMargin: PropTypes.bool,
    limit: PropTypes.number,

    // more button
    fetchPath: PropTypes.string.isRequired,
    numProducts: PropTypes.number
  };

  static defaultProps = {
    title: "",
    hideHeader: false,
    description: "",
    withMargin: false
  };

  get renderMoreButton() {
    return <MoreFooter {...this.props} />;
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.numProducts !== this.props.numProducts;
  }

  renderItem = ({ item: product }) => {
    return (
      <View style={styles.tile}>
        <ProductTile
          backgroundColor={this.props.backgroundColor}
          onPress={() =>
            this.props.navigation.navigate("Product", {
              product: product
            })
          }
          product={product}/>
      </View>
    );
  };

  render() {
    // TODO: _position animation
    // TODO: _motion animation
    const { listData, withMargin, ...rest } = this.props;

    return (
      <View>
        {!this.props.hideHeader ? <ListHeader {...rest} /> : null}
        <View style={withMargin ? styles.listWrapper : {}}>
          <FlatList
            keyExtractor={item => `product-${item.id}`}
            renderItem={this.renderItem}
            data={
              listData && listData.current() && listData.current().length > 0
                ? listData.current().slice()
                : []
            }
            numColumns={2}
            ListEmptyComponent={
              <ProductList.Placeholder limit={this.props.limit} />
            }/>
        </View>
        {this.renderMoreButton}
      </View>
    );
  }
}

export default withNavigation(List);

const styles = StyleSheet.create({
  listWrapper: {
    padding: Sizes.InnerFrame / 2,
    backgroundColor: Colours.Foreground
  },

  tile: {
    flex: 1,
    paddingHorizontal: Sizes.InnerFrame / 2
  }
});
