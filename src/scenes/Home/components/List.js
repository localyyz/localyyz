import React from "react";
import { StyleSheet, View } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { StaggeredList, MoreTile, ProductTile } from "localyyz/components";

// third party
import { observer } from "mobx-react";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";

// local
import ListHeader from "./ListHeader";

@observer
class List extends React.Component {
  static propTypes = {
    listData: PropTypes.object,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    withMargin: PropTypes.bool
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
                  onPress={() =>
                    navigation.navigate("Product", {
                      product: product
                    })
                  }
                  product={product}/>
              ))}
          </StaggeredList>
        </View>
        <View style={styles.listFooter}>
          <MoreTile
            onPress={() =>
              navigation.navigate("ProductList", {
                fetchPath: this.props.fetchPath,
                title: this.props.title,
                subtitle: this.props.description
              })
            }/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listWrapper: {
    marginVertical: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame,
    backgroundColor: Colours.Foreground
  },

  splitList: {
    paddingHorizontal: Sizes.InnerFrame,
    paddingVertical: Sizes.InnerFrame / 2
  },

  listFooter: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginHorizontal: Sizes.InnerFrame,
    marginVertical: Sizes.InnerFrame / 2
  }
});

export default withNavigation(List);
