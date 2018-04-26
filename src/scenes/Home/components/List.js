import React from "react";
import { StyleSheet, View } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { StaggeredList, MoreTile, ProductTile } from "localyyz/components";

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

  render() {
    // TODO: _position animation
    // TODO: _motion animation
    const { listData, withMargin, navigation, ...rest } = this.props;

    return !listData || listData.current() === undefined ? (
      this.renderLoading
    ) : (
      <View>
        <ListHeader {...rest} />
        <View style={withMargin ? styles.listWrapper : {}}>
          <StaggeredList style={styles.splitList} offset={0}>
            {listData
              .current()
              .slice()
              .map(product => (
                <ProductTile
                  key={`productTile-${product.id}`}
                  backgroundColor={this.props.backgroundColor}
                  onPress={() =>
                    navigation.navigate("Product", {
                      product: product
                    })
                  }
                  product={product}/>
              ))}
          </StaggeredList>
        </View>
        {this.renderMoreButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listWrapper: {
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  splitList: {
    paddingHorizontal: Sizes.InnerFrame
  }
});

export default withNavigation(List);
