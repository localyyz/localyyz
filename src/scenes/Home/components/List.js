import React from "react";
import { Animated, StyleSheet, View } from "react-native";

// custom
import { Colours, Sizes } from "localyyz/constants";
import { StaggeredList, ProductTile } from "localyyz/components";

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

  constructor(props) {
    super(props);

    this._position = new Animated.Value(0);
  }

  render() {
    const { listData, withMargin, navigation, ...rest } = this.props;

    // TODO: loading view
    return !listData || listData.current() === undefined ? (
      <View />
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
                  product={product}
                  motion={this._motion}
                />
              ))}
          </StaggeredList>
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
  }
});

export default withNavigation(List);
