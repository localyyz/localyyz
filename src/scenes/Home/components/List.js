import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { StaggeredList, ProductTile } from "localyyz/components";

// third party
import { observer } from "mobx-react";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import { PropTypes as mobxPropTypes } from "mobx-react";

// local
import ListHeader from "./ListHeader";
import MoreFooter from "./MoreFooter";

@observer
class List extends React.Component {
  static propTypes = {
    // listData input type take a look at home store
    //  fetchFeaturedProducts
    //  fetchDiscountedProducts
    // and https://github.com/mobxjs/mobx-utils#lazyobservable
    listData: mobxPropTypes.objectOrObservableObject,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    withMargin: PropTypes.bool,

    // more button
    fetchPath: PropTypes.string.isRequired,
    numProducts: PropTypes.number
  };

  static defaultProps = {
    title: "",
    description: "",
    withMargin: false
  };

  // TODO: do something here? search suggestions?
  get renderLoading() {
    return <View />;
  }

  get renderMoreButton() {
    return (
      <MoreFooter
        title={this.props.title}
        description={this.props.description}
        fetchPath={this.props.fetchPath}
        basePath={this.props.basePath}
        categories={this.props.categories}
        numProducts={this.props.numProducts}/>
    );
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

    return !listData
      || listData.current() === undefined
      || listData.current().length < 1 ? (
      this.renderLoading
    ) : (
      <View>
        <ListHeader {...rest} />
        <View style={withMargin ? styles.listWrapper : {}}>
          <FlatList
            keyExtractor={item => `product-${item.id}`}
            renderItem={this.renderItem}
            data={listData.current().slice()}
            numColumns={2}
            contentContainerStyle={styles.splitList}/>
        </View>
        {this.renderMoreButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listWrapper: {
    paddingVertical: Sizes.InnerFrame,
    paddingHorizontal: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  tile: {
    flex: 1,
    paddingHorizontal: Sizes.InnerFrame / 2
  },

  splitList: {
    paddingHorizontal: Sizes.InnerFrame
  }
});

export default withNavigation(List);
